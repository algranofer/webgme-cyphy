/**
* Generated by PluginGenerator from webgme on Tue Nov 04 2014 13:59:08 GMT-0600 (Central Standard Time).
*/

define(['plugin/PluginConfig',
        'plugin/PluginBase',
        'jszip',
        'plugin/GenerateDashboard/GenerateDashboard/meta',
        'plugin/GenerateDashboard/GenerateDashboard/dashboardTypes',
        'plugin/AdmExporter/AdmExporter/AdmExporter',
        'xmljsonconverter'
    ], function (PluginConfig, PluginBase, JSZip, MetaTypes, DashboardTypes, AdmExporter, Converter) {
    'use strict';

    /**
    * Initializes a new instance of GenerateDashboard.
    * @class
    * @augments {PluginBase}
    * @classdesc This class represents the plugin GenerateDashboard.
    * @constructor
    */
    var GenerateDashboard = function () {
        // Call base class' constructor.
        PluginBase.call(this);

        this.metaTypes = MetaTypes;
        this.admExporter = null;

        this.dashboardObject = {
            "dashboard": "dashboard blob hash",
            "indexHtml": "index.html blob hash",
            "designs": {},
            "design-space": "design adm string",
            "requirements": "dummy requirements blob hash",
            "results": {
                "resultsMetaresultsJson": null,
                results: {}
            },
            "test-benches": {},
            "manifestProjectJson": null
        };
    };

    // Prototypal inheritance from PluginBase.
    GenerateDashboard.prototype = Object.create(PluginBase.prototype);
    GenerateDashboard.prototype.constructor = GenerateDashboard;

    /**
    * Gets the name of the GenerateDashboard.
    * @returns {string} The name of the plugin.
    * @public
    */
    GenerateDashboard.prototype.getName = function () {
        return "Generate Dashboard";
    };

    /**
    * Gets the semantic version (semver.org) of the GenerateDashboard.
    * @returns {string} The version of the plugin.
    * @public
    */
    GenerateDashboard.prototype.getVersion = function () {
        return "0.1.0";
    };

    /**
    * Gets the description of the GenerateDashboard.
    * @returns {string} The description of the plugin.
    * @public
    */
    GenerateDashboard.prototype.getDescription = function () {
        return "Takes a list of Result Object IDs, and create a Dashboard package for visualization";
    };

    /**
     * Gets the configuration structure for the TestBenchRunner.
     * The ConfigurationStructure defines the configuration for the plugin
     * and will be used to populate the GUI when invoking the plugin from webGME.
     * @returns {object} The version of the plugin.
     * @public
     */
    GenerateDashboard.prototype.getConfigStructure = function () {
        return [
            {
                'name': 'ResultIDs',
                'displayName': 'Result Object IDs',
                'description': 'IDs of Result objects to add to the Generated Dashboard, separated by semicolons.',
                'value': '',
                'valueType': 'string',
                'readOnly': false
            }
        ];
    };

    /**
    * Main function for the plugin to execute. This will perform the execution.
    * Notes:
    * - Always log with the provided logger.[error,warning,info,debug].
    * - Do NOT put any user interaction logic UI, etc. inside this method.
    * - callback always has to be called even if error happened.
    *
    * @param {function(string, plugin.PluginResult)} callback - the result callback
    */
    GenerateDashboard.prototype.main = function (callback) {
        // Use self to access core, project, result, logger etc from PluginBase.
        // These are all instantiated at this point.
        var self = this,
            //config = self.getCurrentConfig(),
            workspaceName = self.core.getAttribute(self.rootNode, 'name'),// NOPE. this is 'ADMEditor', not 'rollo'
            designName = self.core.getAttribute(self.activeNode, 'name'),
            designObjectID = self.core.getPath(self.activeNode),
            designID = self.core.getGuid(self.activeNode),
            resultObjectIDs = [
                "/243203739/1914067160/1594627875/738670268/1604609344/1138983316",
                "/243203739/1914067160/1594627875/738670268/1604609344/638117119",
                "/243203739/1914067160/1594627875/738670268/14675327/721601556",
                "/243203739/1914067160/1594627875/738670268/14675327/669656366"
            ];

        self.updateMETA(self.metaTypes);

        // Run AdmExporter to get design_space/%ThisDesignName%.adm
        self.initializeAdmExporter(designObjectID);

        // self.activeNode needs to be the design, 2nd argument is bool: include/return acm files
        var exploreDesignCallbackFunction = function (err) {
            if (err) {
                self.logger.error('AdmExporter.exploreDesign failed with error: ' + err);
                self.logger.error(err);
                self.result.setSuccess(false);
                return callback(err, self.result);
            }

            var admData = self.admExporter.admData;

            // Create a manifest_project object (like the manifest.project.json file)
            self.dashboardObject.manifestProjectJson = new DashboardTypes.manifestProjectJson(workspaceName);

            // Create a results_metaresults object (like the results.metaresults.json file)
            self.dashboardObject.results.resultsMetaresultsJson = new DashboardTypes.resultsMetaresultsJson();

            var getResultsCallbackFunction = function (err) {
                if (err) {
                    self.logger.error(err);
                    self.result.setSuccess(false);
                    return callback(err, self.result);
                }

                // we should have here a full 'self.dashboardObject', ready for creating an artifact (???)

                self.result.setSuccess(true);
                self.save('added obj', function (err) {
                    callback(null, self.result);
                });
            };

            self.getResults(designName, designID, resultObjectIDs, getResultsCallbackFunction);

        };
        
        self.admExporter.exploreDesign(self.activeNode, false, exploreDesignCallbackFunction);
    };

    GenerateDashboard.prototype.getResults = function (designSpaceName, designSpaceID, resultObjectIDs, callback) {
        var self = this,
            resultCounter = 0,
            cumulativeError = "";

        var incrementCounterCallback = function (err) {
            if (err) {
                cumulativeError += err;
            }

            resultCounter += 1;

            if (resultCounter === resultObjectIDs.length) {
                return callback(cumulativeError);
            }
        };

        // Iterate over the list of Result IDs (async with counter)
        var loadByPathCallbackFunction = function (err, loadedNode) {
            if (err) {
                return incrementCounterCallback(err);
            }

            self.readAndModifyResultData(loadedNode, designSpaceName, designSpaceID, incrementCounterCallback);
        };

        for (var i=0;i<resultObjectIDs.length;i++) {

            self.core.loadByPath(self.rootNode, resultObjectIDs[i], loadByPathCallbackFunction);
        }
    };

    GenerateDashboard.prototype.readAndModifyResultData = function (resultNode, designSpaceName, designSpaceID, callback) {
        var self = this,
            tbManifestHash = self.core.getAttribute(resultNode, 'Artifacts'),
            cfgAdmHash = self.core.getAttribute(resultNode, 'CfgAdm');

        var getCfgAdmCallbackFunction = function (err, admData) {
            if (err) {
                return callback(err);
            }

            // 'rename' it (designSpaceName), and set the ID (designSpaceID)
            self.logger.info(admData);
        };

        self._getCfgAdm(cfgAdmHash, getCfgAdmCallbackFunction);
        //self.getCfgAdm(cfgAdmHash, getCfgAdmCallbackFunction);

        // get the testbench_manifest.json - need to modify it to point to designSpaceID
        // follow the pointer to the Testbench object, and get/create the ThisTestBench.testbench.json file/object
    };

    GenerateDashboard.prototype.getCfgAdm = function (fileHash, callback) {
        var self = this,
            admData,
            arrayElementsInXml = {
                Design: false,
                RootContainer: false,
                Value: false,
                Container: true,
                Connector: true,
                Property: true,
                Formula: true,
                Operand: true,
                ValueFlowMux: true,
                ComponentInstance: true,
                PrimitivePropertyInstance: true,
                ConnectorInstance: true,
                PortInstance: true,
                Role: true,
                Port: true
            },
            xml2json = new Converter.Xml2json({
                skipWSText: true,
                arrayElements: arrayElementsInXml
            }),
            blobGetObjectCallbackFunction = function (err, xmlArrayBuffer) {
                if (err) {
                    var msg = "Could not get adm from xml " + fileHash + ": " + err;
                    return callback(msg);
                }

                admData = xml2json.convertFromBuffer(xmlArrayBuffer);
                if (admData instanceof Error) {
                    self.createMessage(null, 'Given adm not valid xml: ' + admData.message, 'error');
                    return callback("Could not get adm from xml " + fileHash);
                }

                return admData;
            };

        // get the cfg.adm as a string/object (blobClient, async)
        self.blobClient.getObject(fileHash, blobGetObjectCallbackFunction);
    };

    GenerateDashboard.prototype._getCfgAdm = function (fileHash, callback) {
        var self = this;

        var blobGetMetadataCallback = function (err, metadata) {
            if (err) {
                callback(err);
                return;
            }

            var metadataContent = metadata.content;

            var blobGetObjectCallback = function (err, objectContent) {
                if (err) {
                    callback(err);
                    return;
                }

                var cfgAdmXmlString = String.fromCharCode.apply(null, new Uint8Array(objectContent));
                callback(null, cfgAdmXmlString);

//                var zip,
//                    cfgObject,
//                    cfgContentName,
//                    cfgContent,
//                    cfgAsZip,
//                    cfgFileHash,
//                    cfgAdmXml,
//                    cfgAdmJson,
//                    mapHash2json = {},
//                    admsWithinZip,
//                    numAdms,
//                    i;
//
//                // TODO: what if the content is not a ZIP? TODO: check metadata
//                zip = new JSZip(objectContent);
//
//                //cfgAdmXml = zip.file("modelDescription.xml");
//                cfgAdmXml = zip.file(/\.adm/);
//
//                if (cfgAdmXml === null) {
//                    // we might have a zip with multiple fmus within
//                    admsWithinZip = zip.file(/\.adm/);
//                    numAdms = admsWithinZip.length;
//
//                    for (i = 0; i < numAdms; i += 1) {
//                        cfgObject = admsWithinZip[i];
//                        cfgContentName = cfgObject.name;
//                        cfgContent = cfgObject.asArrayBuffer();
//                        cfgAsZip = new JSZip(cfgContent);
//                        cfgFileHash = metadataContent[cfgContentName].content;  // blob 'soft-link' hash
//                        cfgAdmXml = cfgAsZip.file("modelDescription.xml");
//                        if (cfgAdmXml !== null) {
//                            cfgAdmJson = self.convertXml2Json(cfgAdmXml.asText());
//                            mapHash2json[cfgFileHash] = cfgAdmJson;
//                        } else {
//                            self.logger.error('Could not extract fmu modelDescription');
//                            continue;
//                        }
//                    }
//                } else {
//                    cfgAdmJson = self.convertXml2Json(cfgAdmXml.asText());
//                    mapHash2json[fileHash] = cfgAdmJson;
//                }
//
//                // return .\modelDescription.xml
//                callback(null, cfgAdmXml.asText());
            };

            self.blobClient.getObject(fileHash, blobGetObjectCallback);
        };

        self.blobClient.getMetadata(fileHash, blobGetMetadataCallback);
    };

    GenerateDashboard.prototype.initializeAdmExporter = function (designPath) {
        var self = this;
        if (self.admExporter === null) {
            self.admExporter = new AdmExporter();
            self.admExporter.meta = self.metaTypes;  // meta is defined here (points to adjacent meta.js file)
            self.admExporter.META = self.META;  // META is from PluginBase
            self.admExporter.core = self.core;
            self.admExporter.logger = self.logger;
            self.admExporter.result = self.result;
            self.admExporter.rootPath = designPath || null;
            self.admExporter.rootNode = self.rootNode;
            self.logger.info('AdmExporter had not been initialized - created a new instance.');
        } else {
            self.admExporter.acmFiles = {};
            self.admExporter.gatheredAcms = {};
            self.admExporter.rootPath = designPath || null;
            self.admExporter.includeAcms = true;
            self.logger.info('AdmExporter had already been initialized - reset acmFiles, gatheredAcms and rootPath.');
        }
    };

    return GenerateDashboard;
});