/*globals angular*/

/**
 * @author pmeijer / https://github.com/pmeijer
 * @author lattmann / https://github.com/lattmann
 */


angular.module('cyphy.services')
    .service('WorkspaceService', function ($q, NodeService) {
        'use strict';
        var watchers = {};
        this.getWorkspaces = function () {
            throw new Error('Not implemented yet.');
        };

        this.createWorkspace = function (data, otherWorkspaceId) {
            throw new Error('Not implemented yet.');
        };

        this.deleteWorkspace = function (workspaceId) {
            throw new Error('Not implemented yet.');
        };

        this.exportWorkspace = function (workspaceId) {
            throw new Error('Not implemented yet.');
        };

        this.watchWorkspaces = function (parentContext, updateListener) {
            var deferred = $q.defer(),
                regionId = parentContext.regionId + '_watchWorkspaces',
                context = {
                    db: parentContext.db,
                    projectId: parentContext.projectId,
                    branchId: parentContext.branchId,
                    regionId: regionId
                },
                data = {
                    regionId: regionId,
                    workspaces: {} // workspace = {id: <string>, name: <string>, description: <string>}
                };

            watchers[parentContext.regionId] = watchers[parentContext.regionId] || {};
            watchers[parentContext.regionId][context.regionId] = context;
            NodeService.getMetaNodes(context).then(function (meta) {
                NodeService.loadNode(context, '')
                    .then(function (rootNode) {
                        rootNode.loadChildren().then(function (children) {
                            var i,
                                childNode,
                                wsId,
                                onUpdate = function (id) {
                                    var newName = this.getAttribute('name'),
                                        newDesc = this.getAttribute('INFO'),
                                        hadChanges = false;
                                    if (newName !== data.workspaces[id].name) {
                                        data.workspaces[id].name = newName;
                                        hadChanges = true;
                                    }
                                    if (newDesc !== data.workspaces[id].description) {
                                        data.workspaces[id].description = newDesc;
                                        hadChanges = true;
                                    }
                                    if (hadChanges) {
                                        updateListener({id: id, type: 'update', data: data.workspaces[id]});
                                    }
                                },
                                onUnload = function (id) {
                                    delete data.workspaces[id];
                                    updateListener({id: id, type: 'unload', data: null});
                                };
                            for (i = 0; i < children.length; i += 1) {
                                childNode = children[i];
                                if (NodeService.isMetaTypeOf(childNode, meta.WorkSpace)) {
                                    wsId = childNode.getId();
                                    data.workspaces[wsId] = {
                                        id: wsId,
                                        name: childNode.getAttribute('name'),
                                        description: childNode.getAttribute('INFO')
                                    };
                                    childNode.onUpdate(onUpdate);
                                    childNode.onUnload(onUnload);
                                }
                            }
                            rootNode.onNewChildLoaded(function (newChild) {
                                if (NodeService.isMetaTypeOf(newChild, meta.WorkSpace)) {
                                    wsId = newChild.getId();
                                    data.workspaces[wsId] = {
                                        id: wsId,
                                        name: newChild.getAttribute('name'),
                                        description: newChild.getAttribute('INFO')
                                    };
                                    newChild.onUpdate(onUpdate);
                                    newChild.onUnload(onUnload);
                                    updateListener({id: wsId, type: 'load', data: data.workspaces[wsId]});
                                }
                            });
                            deferred.resolve(data);
                        });
                    });
            });

            return deferred.promise;
        };

        this.watchNumberOfComponents = function (parentContext, workspaceId, updateListener) {
            var deferred = $q.defer(),
                regionId = parentContext.regionId + '_watchNumberOfComponents_' + workspaceId,
                context = {
                    db: parentContext.db,
                    projectId: parentContext.projectId,
                    branchId: parentContext.branchId,
                    regionId: regionId
                },
                data = {
                    regionId: regionId,
                    count: 0
                },
                watchFromFolderRec = function (folderNode, meta) {
                    var recDeferred = $q.defer();
                    folderNode.loadChildren().then(function (children) {
                        var i,
                            queueList = [],
                            childNode,
                            onUnload = function (id) {
                                data.count -= 1;
                                updateListener({id: id, type: 'unload', data: data.count});
                            };
                        for (i = 0; i < children.length; i += 1) {
                            childNode = children[i];
                            if (NodeService.isMetaTypeOf(childNode, meta.ACMFolder)) {
                                queueList.push(watchFromFolderRec(childNode, meta));
                            } else if (NodeService.isMetaTypeOf(childNode, meta.AVMComponentModel)) {
                                data.count += 1;
                                childNode.onUnload(onUnload);
                            }
                        }

                        folderNode.onNewChildLoaded(function (newChild) {
                            if (NodeService.isMetaTypeOf(newChild, meta.ACMFolder)) {
                                watchFromFolderRec(newChild, meta).then(function () {
                                    updateListener({id: newChild.getId(), type: 'load', data: data.count});
                                });
                            } else if (NodeService.isMetaTypeOf(newChild, meta.AVMComponentModel)) {
                                data.count += 1;
                                newChild.onUnload(onUnload);
                                updateListener({id: newChild.getId(), type: 'load', data: data.count});
                            }
                        });
                        if (queueList.length === 0) {
                            recDeferred.resolve();
                        } else {
                            $q.all(queueList).then(function () {
                                recDeferred.resolve();
                            });
                        }
                    });

                    return recDeferred.promise;
                };

            watchers[parentContext.regionId] = watchers[parentContext.regionId] || {};
            watchers[parentContext.regionId][context.regionId] = context;
            NodeService.getMetaNodes(context).then(function (meta) {
                NodeService.loadNode(context, workspaceId)
                    .then(function (workspaceNode) {
                        workspaceNode.loadChildren().then(function (children) {
                            var i,
                                queueList = [],
                                childNode;
                            for (i = 0; i < children.length; i += 1) {
                                childNode = children[i];
                                if (NodeService.isMetaTypeOf(childNode, meta.ACMFolder)) {
                                    queueList.push(watchFromFolderRec(childNode, meta));
                                }
                            }
                            workspaceNode.onNewChildLoaded(function (newChild) {
                                if (NodeService.isMetaTypeOf(newChild, meta.ACMFolder)) {
                                    watchFromFolderRec(newChild, meta).then(function () {
                                        updateListener({id: newChild.getId(), type: 'load', data: data.count});
                                    });
                                }
                            });
                            if (queueList.length === 0) {
                                deferred.resolve(data);
                            } else {
                                $q.all(queueList).then(function () {
                                    deferred.resolve(data);
                                });
                            }
                        });
                    });
            });

            return deferred.promise;
        };

        this.watchNumberOfDesigns = function (parentContext, workspaceId, updateListener) {
            throw new Error('Not implemented yet.');
        };

        this.watchNumberOfTestBenches = function (parentContext, workspaceId, updateListener) {
            throw new Error('Not implemented yet.');
        };
        /**
         * Removes all watchers spawned from parentContext.
         * @param parentContext - context of controller.
         */
        this.cleanUpAllRegions = function (parentContext) {
            var childWatchers,
                key;
            if (watchers[parentContext.regionId]) {
                childWatchers = watchers[parentContext.regionId];
                for (key in childWatchers) {
                    if (childWatchers.hasOwnProperty(key)) {
                        NodeService.cleanUpRegion(childWatchers[key]);
                    }
                }
                delete watchers[parentContext.regionId];
            } else {
                console.log('Nothing to clean-up..');
            }
        };

        /**
         * Removes specified watcher (regionId)
         * @param parentContext
         * @param regionId
         */
        this.cleanUpRegion = function (parentContext, regionId) {
            if (watchers[parentContext.regionId]) {
                if (watchers[parentContext.regionId][regionId]) {
                    NodeService.cleanUpRegion(regionId);
                    delete watchers[parentContext.regionId][regionId];
                } else {
                    console.log('Nothing to clean-up..');
                }
            } else {
                console.log('Cannot clean-up region since parentContext is not registered..', parentContext);
            }
        };
    });