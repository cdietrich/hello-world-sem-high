import { MonacoEditorLanguageClientWrapper } from './monaco-editor-wrapper/bundle/index.js';
import { buildWorkerDefinition } from "./monaco-editor-workers/index.js";
//import { buildWorkerDefinition } from "monaco-editor-workers";

buildWorkerDefinition('./monaco-editor-workers/dist/workers', import.meta.url, false)

const languageId = 'hello';

const workerURL = new URL('./hello-world-server-worker.js', import.meta.url);
const lsWorker = new Worker(workerURL.href, {
    type: 'classic',
    name: 'hello-world-language-server-worker'
});

// setup the language client config with the worker
const languageClientConfig = {
    options: {
        $type: 'WorkerDirect',
        worker: lsWorker
    }
};

const monarchGrammar = {
    // recognized keywords
    keywords: [
        'color','def','down','for','move','pen','to','up'
    ],
    // recognized operators
    operators: [
        '-',',','*','/','+','='
    ],
    // pattern for symbols we want to highlight
    symbols:  /-|,|\(|\)|\{|\}|\*|\/|\+|=/,

    // tokenizer itself, starts at the first 'state' (entry), which happens to be 'initial'
    tokenizer: {
        initial: [
            { regex: /[_a-zA-Z][\w_]*/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"ID"} }} },
            { regex: /[0-9]+/, action: {"token":"number"} },
            { regex: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/, action: {"token":"string"} },
            { include: '@whitespace' },
            { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
        ],
        whitespace: [
            { regex: /\s+/, action: {"token":"white"} },
            { regex: /\/\*/, action: {"token":"comment","next":"@comment"} },
            { regex: /\/\/[^\n\r]*/, action: {"token":"comment"} },
        ],
        comment: [
            { regex: /[^\/\*]+/, action: {"token":"comment"} },
            { regex: /\*\//, action: {"token":"comment","next":"@pop"} },
            { regex: /[\/\*]/, action: {"token":"comment"} },
        ],
    }
};

// keep a reference to a promise for when the editor is finished starting, we'll use this to setup the canvas on load
// create a client wrapper
const client = new MonacoEditorLanguageClientWrapper();
// start the editor
// keep a reference to a promise for when the editor is finished starting, we'll use this to setup the canvas on load
let codeMain = `Hello A1!
Hello B1!
person MyP
Hello MyP! /*test*/`;


const userConfig = {
    htmlElement: document.getElementById('monaco-editor-root'),
    wrapperConfig: {
        serviceConfig: {
            enableModelService: true,
            configureEditorOrViewsService: {
            },
            configureConfigurationService: {
                defaultWorkspaceUri: '/tmp/'
            },
            enableLanguagesService: true,
            enableKeybindingsService: true,
            debugLogging: true
        },
        editorAppConfig: {
            $type: 'classic',
            languageId: languageId,
            code: codeMain,
            useDiffEditor: false,
            // configure it like this or in the userConfiguration
            editorOptions: {
                'semanticHighlighting.enabled': true
            },
            languageExtensionConfig: { id: 'langium' },
            languageDef: monarchGrammar,
            // themeData: LangiumTheme,
            // theme: 'langium-theme',
            userConfiguration: {
                // or configure the semantic highlighting like this:
                // `{ json: "editor.semanticHighlighting.enabled": true }`
                json: '{"editor.semanticHighlighting.enabled": true}'
            }
        }
    },
    languageClientConfig: languageClientConfig
};
client.start(userConfig);
