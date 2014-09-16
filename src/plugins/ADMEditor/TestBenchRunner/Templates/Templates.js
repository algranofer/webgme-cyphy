/* Generated file based on ejs templates */
define([], function() {
    return {
    "execute.py.ejs": "import os\nimport sys\nimport json\nimport shutil\nimport zipfile\nimport logging\nimport subprocess\nimport pywintypes\nimport win32com.client\n## Setup a logger\nlogger = logging.getLogger()\nlogger.setLevel(logging.DEBUG)\n\n# Create file handler which logs even debug messages.\nif not os.path.isdir('log'):\n    os.mkdir('log')\n\nfh = logging.FileHandler(os.path.join('log', 'execute.log'))\nfh.setLevel(logging.DEBUG)\n\n# Create console handler to stdout with logging level info.\nch = logging.StreamHandler(sys.stdout)\nch.setLevel(logging.INFO)\n\n# Create console handler to stderr with logging level error.\nch_err = logging.StreamHandler()\nch_err.setLevel(logging.ERROR)\n\n# Create formatter and add it to the handlers.\nformatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')\nfh.setFormatter(formatter)\nch.setFormatter(formatter)\nch_err.setFormatter(formatter)\n\n# Add the handlers to the logger.\nlogger.addHandler(fh)\nlogger.addHandler(ch)\nlogger.addHandler(ch_err)\n\n\n## Obtain the root directory for the META-tools.\n# Get the running meta-python path.\nsys_pieces = sys.executable.split(os.path.sep)\n# Drop the 'bin/Python27/Scripts/python.exe' part.\nif len(sys_pieces) < 4:\n    logger.error('Python script must be called using the META-python virtual env!')\n    sys.exit(1)\nsys_pieces = sys_pieces[:-4]\n# Make sure to get the slashes after e.g. \"C:\".\nif sys_pieces[0].endswith(':'):\n    sys_pieces[0] = sys_pieces[0] + os.path.sep\n# Join the pieces.\nMETA_DIR = os.path.join(*sys_pieces)\n\n# Disable early binding: full of race conditions writing the cache files,\n# and changes the semantics since inheritance isn't handled correctly\nimport win32com.client.gencache\n_savedGetClassForCLSID = win32com.client.gencache.GetClassForCLSID\nwin32com.client.gencache.GetClassForCLSID = lambda x: None\n\n\ndef call_subprocess_with_logging(command, my_env=None):\n    \"\"\"\n    Calls the command, if error occurred logging is made of all non-empty returns.\n    Reraises the exception putting the formatet message in returncode\n\n    :param command: the command to be executed\n    :param my_env: dictionary of environment-variables, None -> uses the default windows\n    \"\"\"\n    logger.info(\"About to call : {0}\".format(command))\n    return_code = 0\n    try:\n        if my_env:\n            return_out = subprocess.check_output(command, stderr=subprocess.STDOUT, env=my_env, shell=True)\n        else:\n            return_out = subprocess.check_output(command, stderr=subprocess.STDOUT, shell=True)\n        logger.info('console output : \\n{0}'.format(return_out))\n    except subprocess.CalledProcessError as err:\n        msg = \"Subprocess call failed!\"\n        msg += \"\\n  return-code   : {0}\".format(err.returncode)\n        return_code = err.returncode\n        if err.output:\n            msg += \"\\n  console output: \\n\\n{0}\".format(err.output)\n        if err.message:\n            msg += \"\\n  error message : {0}\".format(err.message)\n        logger.error(msg)\n\n    return return_code\n\n\n\ndef parse_xme_and_save_to_mga(file_name):\n    \"\"\"\n    Imports the xme project and saves it to a mga-file with the same name.\n    (Will overwrite any existing mga with same path.)\n\n    returns : mga_path : path to newly created mga\n    \"\"\"\n    mga_file = file_name[:-4] + '.mga'\n    mga_path = os.path.abspath(mga_file)\n    logger.debug(\"About to parse .xme, mga will be saved to \" + mga_path)\n    parser = win32com.client.Dispatch('Mga.MgaParser')\n    (paradigm, paradigm_v, paradigm_guid, basename, version) = parser.GetXMLInfo(file_name)\n    logger.debug('Xme info :')\n    logger.debug('  paradigm     : {0}'.format(paradigm))\n    logger.debug('  paradigm_v   : {0}'.format(paradigm_v))\n    import uuid\n    logger.debug('  paradigm_guid: {0}'.format(str(uuid.UUID(bytes_le=paradigm_guid))))\n    logger.debug('  basename     : {0}'.format(basename))\n    logger.debug('  version      : {0}'.format(version))\n    if paradigm != 'CyPhyML':\n        raise IOError(\"Given xme file must be using CyPhyML as paradigm, not {0}\".format(paradigm))\n\n    project = win32com.client.Dispatch('Mga.MgaProject')\n    project.Create('MGA={0}'.format(mga_path), paradigm)\n    try:\n        parser.ParseProject(project, file_name)\n        project.Save()\n        logging.debug(\"Mga saved to \" + mga_file)\n    finally:\n        project.Close(True)\n\n    return mga_path\n\n\ndef extract_components(src_path='ACMs', dst_path='components_extracted'):\n    if os.path.isdir(dst_path):\n        logging.debug('Found dir :{0} - removing and making new...'.format(dst_path))\n        shutil.rmtree(dst_path)\n        os.mkdir(dst_path)\n    files = os.listdir(src_path)\n    logging.debug('Components found in directory : {0}'.format(files))\n    for f_name in files:\n        if f_name.endswith('.zip'):\n            zippy = zipfile.ZipFile(os.path.join(src_path, f_name))\n            zippy.extractall('\\\\\\\\?\\\\' + os.path.join(os.getcwd(), dst_path, f_name.rstrip('.zip')))\n\n\ndef import_components(mga_path, dir_path='components_extracted'):\n    exec_name = 'CyPhyComponentImporterCL.exe'\n    exec_path = os.path.join(META_DIR, 'bin', exec_name)\n    if not os.path.isfile(exec_path):\n        logging.debug('Did not find {0} in bin directory.'.format(exec_name))\n        logging.debug('Assuming developer machine, looking in src directory...'.format(exec_name))\n        exec_path = os.path.join(META_DIR, 'src', 'CyPhyComponentImporterCL', 'bin', 'Release', exec_name)\n        if not os.path.isfile(exec_path):\n            raise IOError('Did not find {0}'.format(exec_path))\n\n    command = '\"{0}\" -r \"{1}\" \"{2}\"'.format(exec_path, dir_path, mga_path)\n    rc = call_subprocess_with_logging(command)\n\n    return rc\n\n\ndef import_design(mga_path, adm_file, testbench_config):\n    project_conn_str = 'MGA={0}'.format(mga_path)\n    project = win32com.client.Dispatch('Mga.MgaProject')\n    project.Open(project_conn_str)\n    design_ids = []\n    is_in_transaction = False\n    try:\n        design_importer = win32com.client.Dispatch('MGA.Interpreter.CyPhyDesignImporter')\n        design_importer.Initialize(project)\n        logger.debug('About to begin transaction..')\n        project.BeginTransactionInNewTerr()\n        logger.debug('Transaction began.')\n        is_in_transaction = True\n        ## Find the test-bench and find the design placeholder.\n        testbench_mga = project.ObjectByPath(testbench_config['path'])\n        if not testbench_mga:\n            raise RuntimeError('Given test-bench path \"' + testbench_config['path'] + '\" does not exist in project!')\n        try:\n            logger.debug('Path returned MgaObject of type: {0}'.format(testbench_mga.MetaBase.Name))\n            if not testbench_mga.MetaBase.Name == 'TestBench':\n                raise NotImplementedError('Only CyPhy TestBench supported!')\n            testbench_id = testbench_mga.ID\n            logger.debug('Found test-bench \"{0}\".'.format(testbench_mga.Name))\n            logger.debug('Test-bench ID : {0}.'.format(testbench_id))\n            tlsut_mga = [o for o in testbench_mga.GetChildrenOfKind('TopLevelSystemUnderTest')][0]\n            logger.debug('TopLevelSystem under test {0} refers to :'.format(tlsut_mga.Name))\n            logger.debug(' \"{0}\" ({1})'.format(tlsut_mga.Referred.Name, tlsut_mga.Referred.MetaBase.Name))\n        except pywintypes.com_error as err:\n            logger.error(err.message)\n            raise RuntimeError('Given test-bench not found or setup correctly.')\n        ## Import the design.\n        logger.debug('Calling CyPhyDesignImporter.ImportDesign.')\n        design_mga = design_importer.ImportDesignToDesignSpace(project, adm_file)\n        design_id = design_mga.ID\n        logger.debug('Design imported:')\n        logger.debug(' Name : {0}'.format(design_mga.Name))\n        logger.debug(' Type : {0}'.format(design_mga.MetaBase.Name))\n        logger.debug(' ID : {0}'.format(design_id))\n        logger.debug(' Path : {0}'.format(design_mga.AbsPath))\n\n        if design_mga.MetaBase.Name == 'DesignContainer':\n            logger.info('Creating DesignSpaceHelper')\n            desert = win32com.client.Dispatch('MGA.Interpreter.DesignSpaceHelper')\n            desert.Initialize(project)\n            logger.info('Calling ApplyConstraintsAndGenerateCWCs')\n            # selectedObjs = win32com.client.Dispatch('Mga.MgaFCOs')\n            desert.ApplyConstraintsAndGenerateCWCs(project, design_mga, False)\n            configurations = design_mga.GetChildrenOfKind('Configurations')\n            if configurations.Count == 0:\n                logger.warning('No Configurations found')\n            for cc in configurations:\n                logger.info('Found Configurations \"{0}\" inside design.'.format(cc.Name))\n                cfg_mgas = cc.GetChildrenOfKind('CWC')\n                for cfg_mga in cfg_mgas:\n                    logger.info(cfg_mga.AbsPath)\n                    design_ids.append(cfg_mga.ID)\n        else:\n            design_ids.append(design_id)\n        ## Reference the design from the top-level-system-under-test.\n        logger.debug('Creating ReferenceSwitcher')\n        ref_switcher = win32com.client.Dispatch('MGA.Interpreter.ReferenceSwitcher')\n        logger.debug('Switching referred in test-bench to design.')\n        tlsut_mga.Name = design_mga.Name\n        ref_switcher.SwitchReference(design_mga, tlsut_mga)\n        logger.debug('Design was placed in test-bench.')\n        logger.debug('About to commit transaction..')\n        project.CommitTransaction()\n        logger.debug('Transaction committed.')\n        is_in_transaction = False\n    finally:\n        if is_in_transaction:\n            logger.debug('About to abort transaction..')\n            project.AbortTransaction()\n            logger.debug('Transaction aborted.')\n            project.Close(True)\n        else:\n            logger.debug('About to save project..')\n            project.Close(False)\n            logger.debug('Project saved.')\n\n    return testbench_id, design_ids\n\n\ndef call_master_interpreter(mga_path, test_bench_id, cfg_ids):\n    project_conn_str = 'MGA={0}'.format(mga_path)\n    project = win32com.client.Dispatch('Mga.MgaProject')\n    project.Open(project_conn_str)\n    nbr_of_failures = 0\n    nbr_of_cfgs = 0\n    try:\n        logger.debug('Creating CyPhyMasterInterpreterAPI')\n        mi = win32com.client.Dispatch('CyPhyMasterInterpreter.CyPhyMasterInterpreterAPI')\n        mi.Initialize(project)\n        logger.debug('Creating ConfigurationSelectionLight')\n        config_light = win32com.client.Dispatch('CyPhyMasterInterpreter.ConfigurationSelectionLight')\n        config_light.ContextId = test_bench_id\n        config_light.SetSelectedConfigurationIds(cfg_ids)\n        config_light.KeepTemporaryModels = False\n        config_light.PostToJobManager = False\n        mi_results = mi.RunInTransactionWithConfigLight(config_light)\n        mi.WriteSummary(mi_results)\n\n        for res in mi_results:\n            nbr_of_cfgs += 1\n            logger.info('MasterInterpreter result : {0}'.format(res.Message))\n            if not res.Success:\n                logger.error('MasterIntpreter failed : {0}, Exception : {1}'.format(res.Message, res.Exception))\n                nbr_of_failures += 1\n        if nbr_of_failures > 0:\n            with open('_FAILED.txt', 'ab+') as f_out:\n                f_out.write('MasterInterprter failed on ' + str(nbr_of_failures) + ' out of ' + str(nbr_of_cfgs) +\n                            ' configurations. See log/execution.log and log/MasterInerpter.xxxx.log for more info.')\n    finally:\n        project.Close(True)\n\n    if nbr_of_failures == nbr_of_cfgs:\n        logger.error('No succeeded configurations from MasterInterpreter, aborting script..')\n        sys.exit(1)\n\n\ndef run_execution_jobs():\n    jobs = []\n    for root, dirs, files in os.walk('results'):\n        for f in files:\n            if f == 'testbench_manifest.json':\n                with open(os.path.join(root, 'testbench_manifest.json'), 'r') as f_in:\n                    tb_dict = json.load(f_in)\n                    if len(tb_dict['Steps']) == 0:\n                        logger.warning('Skipping job for design ' + tb_dict['DesignID'] + ' in ' + root +\n                                       ', since there are no steps. MasterInterpreter probably failed on this design.')\n                    else:\n                        cmd = tb_dict['Steps'][0]['Invocation']\n                        logger.info('Found cmd {0}'.format(cmd))\n                        job = {'cmd': cmd, 'dir': root, 'designId': tb_dict['DesignID']}\n                        jobs.append(job)\n                        logger.info('Added job {0}'.format(job))\n                break\n    root_dir = os.getcwd()\n    if os.path.isdir('testbench_manifests'):\n        shutil.rmtree('testbench_manifests')\n    os.mkdir('testbench_manifests')\n    failed_jobs = 0\n    nbr_of_jobs = len(jobs)\n    for job in jobs:\n        os.chdir(job['dir'])\n        try:\n            rc = call_subprocess_with_logging(job['cmd'])\n            if rc != 0:\n                logger.error('call failed! {0} in {1}'.format(job['cmd'], job['dir']))\n                failed_jobs += 1\n            elif os.path.isfile('_FAILED.txt'):\n                logger.error('Job \"{0}\" created _FAILED.txt'.format(job['cmd']))\n                failed_jobs += 1\n                with open('_FAILED.txt', 'r') as f_in:\n                    logger.error('\\r\\n'.join(f_in.readlines()))\n        finally:\n            os.chdir(root_dir)\n    if failed_jobs > 0:\n        with open('_FAILED.txt', 'ab+') as f_out:\n            f_out.write(str(failed_jobs) + ' of ' + str(nbr_of_jobs) +' jobs failed! See logs/execute.log.')\n\n\ndef move_dashboard_files(new_dir):\n\n    # Entire directories\n    dashboard_dir = 'dashboard'\n    designs_dir = 'designs'\n    design_space_dir = 'design-space'\n    requirements_dir = 'requirements'\n    test_benches_dir = 'test-benches'\n    results_dir = 'results'\n\n    # Single files\n    meta_results_file = os.path.join(results_dir, 'results.metaresults.json')\n    project_file = 'manifest.project.json'\n    index_html = 'index.html'\n\n    # Delete/Create new result directory.\n    if os.path.isdir(new_dir):\n        shutil.rmtree(new_dir)\n    os.mkdir(new_dir)\n    os.mkdir(os.path.join(new_dir, results_dir))\n    # Copy single files.\n    shutil.copy(meta_results_file, os.path.join(new_dir, meta_results_file))\n    shutil.copy(project_file, os.path.join(new_dir, project_file))\n    shutil.copy(index_html, os.path.join(new_dir, index_html))\n    # Copy entire directories.\n    shutil.copytree(dashboard_dir, os.path.join(new_dir, dashboard_dir))\n    shutil.copytree(designs_dir, os.path.join(new_dir, designs_dir))\n    shutil.copytree(design_space_dir, os.path.join(new_dir, design_space_dir))\n    shutil.copytree(requirements_dir, os.path.join(new_dir, requirements_dir))\n    shutil.copytree(test_benches_dir, os.path.join(new_dir, test_benches_dir))\n\n    for dir_path in (os.path.join(results_dir, dd) for dd in os.listdir(results_dir)):\n        if os.path.isdir(dir_path):\n            tm_path = os.path.join(dir_path, 'testbench_manifest.json')\n            if os.path.isfile(tm_path):\n                os.mkdir(os.path.join(new_dir, dir_path))\n                shutil.copy(tm_path, os.path.join(new_dir, tm_path))\n\n\nif __name__ == '__main__':\n    with zipfile.ZipFile('tbAsset.zip') as zippy:\n        zippy.extractall('.')\n    try:\n        adm_path = [f for f in os.listdir('.') if f.endswith('.adm')][0]\n    except IndexError:\n        logger.error('Could not find an adm at {0}'.format(os.getcwd()))\n        with open('_FAILED.txt', 'ab+') as f_out:\n            f_out.write('Execution failed! See logs/execute.log.')\n        sys.exit(1)\n    try:\n        xme_path = [f for f in os.listdir('.') if f.endswith('.xme')][0]\n    except IndexError:\n        logger.error('Could not find an adm or xme file at {0}'.format(os.getcwd()))\n        with open('_FAILED.txt', 'ab+') as f_out:\n            f_out.write('Execution failed! See logs/execute.log.')\n        sys.exit(1)\n    with open('testbench_config.json', 'r') as f_in:\n        test_bench_config = json.load(f_in)\n    extract_components()\n    logger.info('(1) Components extracted...')\n    mga_file = parse_xme_and_save_to_mga(xme_path)\n    logger.info('(2) Mga created...')\n    rc = import_components(mga_file)\n    if rc == 0:\n        logger.info('(3) Components imported...')\n    else:\n        logger.error('Components could not be imported!')\n        with open('_FAILED.txt', 'ab+') as f_out:\n            f_out.write('Execution failed! See logs/execute.log.')\n        sys.exit(1)\n    try:\n        test_bench_id, cfg_ids = import_design(mga_file, adm_path, test_bench_config)\n    except Exception as err:\n        import traceback\n        the_trace = traceback.format_exc()\n        logger.error('Exception raised in \"import_design\": {0}'.format(the_trace))\n        error_msg = err.message\n        if hasattr(err, 'excepinfo'):\n            error_msg = '{0} : {1}'.format(error_msg, err.excepinfo)\n        with open('_FAILED.txt', 'ab+') as f_out:\n            f_out.write('Could not import design and place it correctly in test-bench. Exception message : ' +\n                        error_msg + ' See logs for more info.')\n            sys.exit(1)\n\n    logger.info('(4) Design imported and placed in test-bench.')\n    call_master_interpreter(mga_file, test_bench_id, cfg_ids)\n    logger.info('(5) MasterInterpreter finished.')\n    run_execution_jobs()\n    logger.info('(6) Job execution completed.')\n",
    "run_execution.cmd.ejs": ":: Executes the package\r\necho off\r\npushd %~dp0\r\n%SystemRoot%\\SysWoW64\\REG.exe query \"HKLM\\software\\META\" /v \"META_PATH\"\r\n\r\nSET QUERY_ERRORLEVEL=%ERRORLEVEL%\r\n\r\nIF %QUERY_ERRORLEVEL% == 0 (\r\n        FOR /F \"skip=2 tokens=2,*\" %%A IN ('%SystemRoot%\\SysWoW64\\REG.exe query \"HKLM\\software\\META\" /v \"META_PATH\"') DO SET META_PATH=%%B)\r\nSET META_PYTHON_EXE=\"%META_PATH%\\bin\\Python27\\Scripts\\Python.exe\"\r\n    %META_PYTHON_EXE% execute.py %1\r\n)\r\nIF %QUERY_ERRORLEVEL% == 1 (\r\n    echo on\r\necho \"META tools not installed.\" >> _FAILED.txt\r\necho \"See Error Log: _FAILED.txt\"\r\nexit /b %QUERY_ERRORLEVEL%\r\n)\r\npopd"
}});