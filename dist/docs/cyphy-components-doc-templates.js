angular.module("cyphy.demoApp.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/docs/cyphy_components_docs.html","<!DOCTYPE html>\r\n<html data-ng-app=\"cyphy.demoApp\">\r\n<head>\r\n    <title>CyPhy Components Documentation</title>\r\n\r\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"../../bower_components/bootstrap/dist/css/bootstrap.min.css\">\r\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"../../bower_components/jquery-ui/themes/black-tie/jquery-ui.css\">\r\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"../../bower_components/angular-growl/build/angular-growl.min.css\">\r\n    <link type=\"text/css\" href=\"../../bower_components/font-awesome/css/font-awesome.min.css\" rel=\"stylesheet\">\r\n\r\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"../../bower_components/isis-ui-components/dist/isis-ui-components.css\">\r\n\r\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"cyphy-components-docs.css\">\r\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"../cyphy-components.css\">\r\n\r\n</head>\r\n<body>\r\n<div growl></div>\r\n<div ng-controller=\"CyPhyComponentsDemoController\" class=\"container\">\r\n\r\n    <h1>cyphy.ui.components</h1>\r\n\r\n    <section ng-repeat=\"component in components\" id=\"{{ component.name }}\">\r\n        <div class=\"page-header\">\r\n            <h1>{{ component.name }}\r\n                <small>(cyphy.ui.{{ component.name }})</small>\r\n            </h1>\r\n        </div>\r\n\r\n        <div class=\"row\">\r\n            <div class=\"col-md-6 show-grid\" ng-include=\"component.template\">\r\n\r\n            </div>\r\n            <div btf-markdown class=\"col-md-6\" ng-include=\"component.docs\">\r\n            </div>\r\n        </div>\r\n            <div class=\"row\">\r\n                <tabset class=\"col-md-12\" ng-if=\"component.sources\">\r\n                    <tab ng-repeat=\"sourceFile in component.sources\"\r\n                         heading=\"{{sourceFile.fileName}}\"\r\n                         select=\"selectedSourceFile=sourceFile\">\r\n                        <div ui-codemirror\r\n                             ui-codemirror-opts=\"sourceFile.viewerOptions\"\r\n                             ng-model=\"sourceFile.code\"\r\n                             ui-refresh=\"selectedSourceFile\"\r\n                             >\r\n\r\n                        </div>\r\n                    </tab>\r\n                </tabset>\r\n            </div>\r\n\r\n    </section>\r\n\r\n</div>\r\n<!--<script src=\"https://code.jquery.com/jquery-2.1.1.min.js\"></script>-->\r\n<!--<script src=\"https://code.jquery.com/ui/1.11.1/jquery-ui.min.js\"></script>-->\r\n<!--<script src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min.js\"></script>-->\r\n<!--<script src=\"//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js\"></script>-->\r\n<!--<script src=\"http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.js\"></script>-->\r\n\r\n<script src=\"../../bower_components/jquery/dist/jquery.min.js\"></script>\r\n<script src=\"../../bower_components/jquery-ui/jquery-ui.min.js\"></script>\r\n<script src=\"../../bower_components/angular/angular.js\"></script>\r\n<script src=\"../../bower_components/bootstrap/dist/js/bootstrap.min.js\"></script>\r\n<script src=\"../../bower_components/angular-bootstrap/ui-bootstrap-tpls.js\"></script>\r\n<script src=\"../../bower_components/angular-ui-utils/ui-utils.min.js\"></script>\r\n<script src=\"../../bower_components/ng-grid/build/ng-grid.min.js\"></script>\r\n\r\n<script src=\"../../bower_components/isis-ui-components/dist/isis-ui-components.js\"></script>\r\n<script src=\"../../bower_components/isis-ui-components/dist/isis-ui-components-templates.js\"></script>\r\n\r\n\r\n<script src=\"../cyphy-components.js\"></script>\r\n<script src=\"../cyphy-components-templates.js\"></script>\r\n\r\n<script src=\"cyphy-components-docs.js\"></script>\r\n<script src=\"cyphy-components-doc-templates.js\"></script>\r\n\r\n</body>\r\n</html>");
$templateCache.put("/library/ComponentList/docs/demo.html","<div>\r\n    <component-list data-workspace-id=\"\'/1/2/3/4/5/6\'\" data-connection-id=\"\'my-db-connection-id\'\"></component-list>\r\n</div>");
$templateCache.put("/library/DesignList/docs/demo.html","<div>\r\n    <design-list data-workspace-id=\"\'/1/2/3/4/5/6\'\"></design-list>\r\n</div>");
$templateCache.put("/library/DesignTree/docs/demo.html","<div>\r\n    <design-tree data-design-id=\"\'/1/2/3/4/5/6\'\"></design-tree>\r\n</div>");
$templateCache.put("/library/WorkersList/docs/demo.html","<div>\r\n    <workers-list></workers-list>\r\n</div>");
$templateCache.put("/library/TestBenchList/docs/demo.html","<div>\r\n    <test-bench-list data-workspace-id=\"\'/1/2/3/4/5/6\'\"></test-bench-list>\r\n</div>");
$templateCache.put("/library/WorkspaceList/docs/demo.html","<div>\r\n    <workspace-list data-connection-id=\"\'my-db-connection-id\'\"></workspace-list>\r\n</div>");
$templateCache.put("/docs/docs_app.js","/*globals angular, require, window, console */\r\n\r\nvar components = [\r\n    {\r\n        name: \'WorkersList\',\r\n        sources: [ \'demo.html\', \'demo.js\']\r\n    }\r\n//    {\r\n//        name: \'WorkspaceList\',\r\n//        sources: [ \'demo.html\', \'demo.js\']\r\n//    },\r\n//    {\r\n//        name: \'ComponentList\',\r\n//        sources: [ \'demo.html\', \'demo.js\']\r\n//    },\r\n//    {\r\n//        name: \'DesignList\',\r\n//        sources: [ \'demo.html\', \'demo.js\']\r\n//    },\r\n//    {\r\n//        name: \'DesignTree\',\r\n//        sources: [ \'demo.html\', \'demo.js\']\r\n//    },\r\n//    {\r\n//        name: \'TestBenchList\',\r\n//        sources: [ \'demo.html\', \'demo.js\']\r\n//    }\r\n];\r\n\r\nrequire(\'chance\');\r\n\r\nangular.module(\'gme.services\', []);\r\n\r\nrequire(\'../library/WorkersList/docs/demo.js\');\r\n//require(\'../library/WorkspaceList/docs/demo.js\');\r\n//require(\'../library/ComponentList/docs/demo.js\');\r\n//require(\'../library/DesignList/docs/demo.js\');\r\n//require(\'../library/DesignTree/docs/demo.js\');\r\n//require(\'../library/TestBenchList/docs/demo.js\');\r\n\r\n\r\nrequire(\'angular-sanitize\');\r\nwindow.Showdown = require(\'showdown\');\r\nrequire(\'angular-markdown-directive\');\r\n\r\nrequire(\'codemirrorCSS\');\r\nwindow.CodeMirror = require(\'code-mirror\');\r\n\r\nrequire(\'code-mirror/mode/htmlmixed\');\r\nrequire(\'code-mirror/mode/xml\');\r\nrequire(\'code-mirror/mode/javascript\');\r\n\r\nrequire(\'angular-ui-codemirror\');\r\n\r\n\r\nvar demoApp = angular.module(\r\n    \'cyphy.demoApp\',\r\n    [\r\n        \'cyphy.demoApp.templates\',\r\n        \'btford.markdown\',\r\n        \'ui.codemirror\',\r\n        \'ui.bootstrap\',\r\n        \'isis.ui.components\'\r\n    ].concat(components.map(function (e) {\r\n        \'use strict\';\r\n\r\n        return \'cyphy.ui.\' + e.name + \'.demo\';\r\n    }))\r\n);\r\n\r\ndemoApp.run(function () {\r\n    \'use strict\';\r\n    console.log(\'DemoApp run...\');\r\n});\r\n\r\ndemoApp.controller(\r\n    \'CyPhyComponentsDemoController\',\r\n    function ($scope, $templateCache) {\r\n        \'use strict\';\r\n\r\n        var fileExtensionRE,\r\n            codeMirrorModes;\r\n\r\n        fileExtensionRE = /(?:\\.([^.]+))?$/;\r\n\r\n        codeMirrorModes = {\r\n            \'js\': \'javascript\',\r\n            \'html\': \'htmlmixed\'\r\n        };\r\n\r\n        $scope.components = components.map(function (component) {\r\n            var sources,\r\n                viewerOptions,\r\n                fileExtension;\r\n\r\n            if (angular.isArray(component.sources)) {\r\n                sources = component.sources.map(function (sourceFile) {\r\n\r\n                    fileExtension = fileExtensionRE.exec(sourceFile);\r\n\r\n                    viewerOptions = {\r\n                        lineWrapping: true,\r\n                        lineNumbers: true,\r\n                        readOnly: \'nocursor\',\r\n                        mode: codeMirrorModes[fileExtension[1]] || \'xml\'\r\n                    };\r\n\r\n                    return {\r\n                        fileName: sourceFile,\r\n                        code: $templateCache.get(\'/library/\' + component.name + \'/docs/\' + sourceFile),\r\n                        viewerOptions: viewerOptions\r\n                    };\r\n                });\r\n            }\r\n\r\n            return {\r\n                name: component.name,\r\n                template: \'/library/\' + component.name + \'/docs/demo.html\',\r\n                docs: \'/library/\' + component.name + \'/docs/readme.md\',\r\n                sources: sources\r\n            };\r\n        });\r\n\r\n    }\r\n);");
$templateCache.put("/library/ComponentList/docs/demo.js","/*globals console, angular, Chance*/\r\n\r\nvar demoApp = angular.module(\'cyphy.ui.ComponentList.demo\', [\r\n    \'cyphy.components\',\r\n    \'cyphy.components.templates\'\r\n]);\r\n\r\n// see ComponentDetails for mocked ComponentService..");
$templateCache.put("/library/DesignList/docs/demo.js","/*globals console, angular, Chance*/\r\n\r\nvar demoApp = angular.module(\'cyphy.ui.DesignList.demo\', [\r\n    \'cyphy.components\',\r\n    \'cyphy.components.templates\'\r\n]);\r\n\r\ndemoApp.service(\'designService\', function () {\r\n    \'use strict\';\r\n\r\n});");
$templateCache.put("/library/DesignTree/docs/demo.js","/*globals console, angular, Chance*/\r\n\r\nvar demoApp = angular.module(\'cyphy.ui.DesignTree.demo\', [\r\n    \'cyphy.components\',\r\n    \'cyphy.components.templates\'\r\n]);\r\n\r\ndemoApp.service(\'designService\', function () {\r\n    \'use strict\';\r\n\r\n    this.watchDesignStructure = function (parentContext, designId, updateListener) {\r\n        var treeStructure;\r\n\r\n        treeStructure = {\r\n            id: \'/1\',\r\n            label: \'Design space name\',\r\n            extraInfo: \'\',\r\n            unCollapsible: true,\r\n            children: [\r\n                {\r\n                    id: \'/1/1\',\r\n                    label: \'Container 1\',\r\n                    extraInfo: \'Compound\',\r\n\r\n                    children: [\r\n                        {\r\n                            id: \'/1/1/1\',\r\n                            label: \'Sub Container 1\',\r\n                            extraInfo: \'Compound\'\r\n                        },\r\n                        {\r\n                            id: \'/1/1/2\',\r\n                            label: \'Sub Container 2\',\r\n                            extraInfo: \'Compound\'\r\n                        },\r\n                        {\r\n                            id: \'/1/1/3\',\r\n                            label: \'Sub Container 3\',\r\n                            extraInfo: \'Compound\'\r\n                        }\r\n                    ],\r\n                    childrenCount: 3\r\n                },\r\n                {\r\n                    id: \'/1/2\',\r\n                    label: \'Container 2\',\r\n                    extraInfo: \'Alternative\'\r\n                },\r\n                {\r\n                    id: \'/1/3\',\r\n                    label: \'Container 3\',\r\n                    extraInfo: \'Optional\'\r\n                }\r\n            ],\r\n            childrenCount: 3\r\n        };\r\n\r\n        updateListener(null, treeStructure);\r\n    };\r\n\r\n});");
$templateCache.put("/library/TestBenchList/docs/demo.js","/*globals console, angular, Chance*/\r\n\r\nvar demoApp = angular.module(\'cyphy.ui.TestBenchList.demo\', [\r\n    \'cyphy.components\',\r\n    \'cyphy.components.templates\'\r\n]);\r\n\r\ndemoApp.service(\'TestBenchService\', function () {\r\n    \'use strict\';\r\n});");
$templateCache.put("/library/WorkersList/docs/demo.js","/*globals console, angular, Chance, setTimeout*/\r\n\r\nvar demoApp = angular.module(\'cyphy.ui.WorkersList.demo\', [\r\n    \'cyphy.components\',\r\n    \'cyphy.components.templates\'\r\n]);\r\n\r\n// overwrite WorkspaceService with dummy data\r\ndemoApp.service(\'executorService\', function ($q) {\r\n    \'use strict\';\r\n    this.getWorkersInfo = function () {\r\n        var deferred = $q.defer(),\r\n            getDummyWorker = function (name) {\r\n                var workerData = {\r\n                    \"clientId\": name,\r\n                    \"lastSeen\": 1409589221.006,\r\n                    \"labels\": [],\r\n                    \"jobs\": [ ]\r\n                };\r\n                if (Math.random() > 0.1) {\r\n                    workerData.jobs.push({\"hash\": \"ff94f3352f5df33656e76ad48dfdsa72c15c2949\", \"resultHashes\": [], \"resultSuperSet\": null,\r\n                        \"userId\": [], \"status\": \"RUNNING\", \"createTime\": \"2014-09-20T19:52:45.329Z\", \"startTime\": null,\r\n                        \"finishTime\": null, \"worker\": name, \"labels\": [\"META_14.09\"]});\r\n                }\r\n                if (Math.random() > 0.3) {\r\n                    workerData.jobs.push({\"hash\": \"idj323352f5df33656e76ad48dfdsa72c15c2949\", \"resultHashes\": [], \"resultSuperSet\": null,\r\n                        \"userId\": [], \"status\": \"RUNNING\", \"createTime\": \"2014-09-11T08:52:45.329Z\", \"startTime\": null,\r\n                        \"finishTime\": null, \"worker\": name, \"labels\": [\"META_14.09\"]});\r\n                }\r\n                if (Math.random() > 0.5) {\r\n                    workerData.jobs.push({\"hash\": \"54efd9352f5df33656e76ad48dfdsa72c15c2949\", \"resultHashes\": [], \"resultSuperSet\": null,\r\n                        \"userId\": [], \"status\": \"RUNNING\", \"createTime\": \"2014-11-02T19:32:45.329Z\", \"startTime\": null,\r\n                        \"finishTime\": null, \"worker\": name, \"labels\": [\"META_14.09\"]});\r\n                }\r\n                return workerData;\r\n            };\r\n\r\n        deferred.resolve({\'patrik-PC_816\': getDummyWorker(\'patrik-PC_816\'), \'worker01_2544\': getDummyWorker(\'worker01_2544\')});\r\n\r\n        return deferred.promise;\r\n    };\r\n\r\n});\r\n");
$templateCache.put("/library/WorkspaceList/docs/demo.js","/*globals console, angular, Chance, setTimeout*/\r\n\r\nvar demoApp = angular.module(\'cyphy.ui.WorkspaceList.demo\', [\r\n    \'cyphy.components\',\r\n    \'cyphy.components.templates\'\r\n]);\r\n\r\n// overwrite WorkspaceService with dummy data\r\ndemoApp.service(\'WorkspaceService\', function ($q, $timeout) {\r\n    \'use strict\';\r\n\r\n    var self = this,\r\n        workspaceUpdateListener;\r\n\r\n    this.duplicateWorkspace = function (context, otherWorkspaceId) {\r\n        console.log(\'Not implemented.\', otherWorkspaceId);\r\n    };\r\n\r\n    this.createWorkspace = function (context, data) {\r\n        console.log(\'Not implemented.\', data);\r\n    };\r\n\r\n    this.deleteWorkspace = function (context, workspaceId, msg) {\r\n        $timeout(function () {\r\n            workspaceUpdateListener({\r\n                id: workspaceId,\r\n                type: \'unload\',\r\n                data: null\r\n            });\r\n        }, 400);\r\n    };\r\n\r\n    this.exportWorkspace = function (workspaceId) {\r\n        console.log(\'Not implemented.\', workspaceId);\r\n    };\r\n\r\n    this.watchWorkspaces = function (parentContext, updateListener) {\r\n        var deferred = $q.defer(),\r\n            i,\r\n            numItems,\r\n            data = {\r\n                regionId: \'region_mockId\',\r\n                workspaces: {} // workspace = {id: <string>, name: <string>, description: <string>}\r\n            };\r\n\r\n        workspaceUpdateListener = updateListener;\r\n\r\n        self.chance = new Chance();\r\n        numItems = 3;\r\n\r\n        for (i = 0; i < numItems; i += 1) {\r\n            data.workspaces[i] = {\r\n                id: i,\r\n                name: self.chance.name(),\r\n                description: self.chance.sentence()\r\n            };\r\n        }\r\n\r\n        $timeout(function () {\r\n            updateListener({\r\n                id: \'update_1\',\r\n                type: \'load\',\r\n                data: {\r\n                    id: \'update_1\',\r\n                    name: \'Created elsewhere\',\r\n                    description: \'New Workspace from update listener\'\r\n                }\r\n            });\r\n        }, 2500);\r\n\r\n        deferred.resolve(data);\r\n\r\n        return deferred.promise;\r\n    };\r\n\r\n    this.watchNumberOfComponents = function (parentContext, workspaceId, updateListener) {\r\n        var deferred = $q.defer();\r\n        $timeout(function () {\r\n            updateListener({id: \'/1/1\', type: \'unload\', data: self.chance.integer({min: 0, max: 175})});\r\n        }, 5000);\r\n        deferred.resolve({\r\n            regionId: workspaceId,\r\n            count: self.chance.integer({min: 0, max: 175})\r\n        });\r\n        return deferred.promise;\r\n    };\r\n\r\n    this.watchNumberOfDesigns = function (parentContext, workspaceId, updateListener) {\r\n        var deferred = $q.defer();\r\n        $timeout(function () {\r\n            updateListener({id: \'/1/1\', type: \'unload\', data: self.chance.integer({min: 0, max: 15})});\r\n        }, 7000);\r\n        deferred.resolve({\r\n            regionId: workspaceId,\r\n            count: self.chance.integer({min: 0, max: 15})\r\n        });\r\n        return deferred.promise;\r\n    };\r\n\r\n    this.watchNumberOfTestBenches = function (parentContext, workspaceId, updateListener) {\r\n        var deferred = $q.defer();\r\n        $timeout(function () {\r\n            updateListener({id: \'/1/1\', type: \'unload\', data: self.chance.integer({min: 0, max: 10})});\r\n        }, 3000);\r\n        deferred.resolve({\r\n            regionId: workspaceId,\r\n            count: self.chance.integer({min: 0, max: 10})\r\n        });\r\n        return deferred.promise;\r\n    };\r\n\r\n    this.cleanUpRegion = function (parentContext, regionId) {\r\n        console.log(\'cleanUpRegion\');\r\n    };\r\n\r\n    this.cleanUpAllRegions = function (parentContext) {\r\n        console.log(\'cleanUpAllRegions\');\r\n    };\r\n\r\n    this.registerWatcher = function (parentContext, fn) {\r\n        fn(false);\r\n    };\r\n});\r\n\r\ndemoApp.service(\'FileService\', function ($q) {\r\n    \'use strict\';\r\n\r\n    this.getDownloadUrl = function (hash) {\r\n        return null;\r\n    };\r\n\r\n    this.saveDroppedFiles = function (files, validExtensions) {\r\n        var deferred = $q.defer(),\r\n            addedFiles = [],\r\n            i;\r\n        for (i = 0; i < files.length; i += 1) {\r\n            addedFiles.push({\r\n                hash: \'\',\r\n                name: files[i].name,\r\n                type: \'zip\',\r\n                size: files[i].size,\r\n                url: \'\'\r\n            });\r\n        }\r\n\r\n        deferred.resolve(addedFiles);\r\n\r\n        return deferred.promise;\r\n    };\r\n});");
$templateCache.put("/library/ComponentList/docs/readme.md","TODO: add description of `ComponentList`");
$templateCache.put("/library/DesignList/docs/readme.md","TODO: add description of `DesignList`");
$templateCache.put("/library/DesignTree/docs/readme.md","TODO: add description of `DesignTree`");
$templateCache.put("/library/TestBenchList/docs/readme.md","TODO: add description of `TestBenchList`");
$templateCache.put("/library/WorkersList/docs/readme.md","`WorkspaceList` components lists all workspaces in a WebGME project that uses the `ADMEditor` meta-model.\r\n\r\nWorkspace item structure\r\n\r\n* `id` - {string} identifier\r\n* `name` - {string} displayed name\r\n* `toolTip` - {string} tool tip on displayed name\r\n* `description` - {string} short description of the content\r\n* `lastUpdated` - {object} \r\n    - `time` - {date|string} date of last update\r\n    - `user` - {name} username who last updated\r\n* `stats` - {array of object} summary of statistics (components, design spaces, test benches, requirements)\r\n\r\nSee `demo.js` for an example.");
$templateCache.put("/library/WorkspaceList/docs/readme.md","`WorkspaceList` components lists all workspaces in a WebGME project that uses the `ADMEditor` meta-model.\r\n\r\nWorkspace item structure\r\n\r\n* `id` - {string} identifier\r\n* `name` - {string} displayed name\r\n* `toolTip` - {string} tool tip on displayed name\r\n* `description` - {string} short description of the content\r\n* `lastUpdated` - {object} \r\n    - `time` - {date|string} date of last update\r\n    - `user` - {name} username who last updated\r\n* `stats` - {array of object} summary of statistics (components, design spaces, test benches, requirements)\r\n\r\nSee `demo.js` for an example.");}]);