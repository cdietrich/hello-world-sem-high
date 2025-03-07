import { EmptyFileSystem, startLanguageServer } from 'langium';
import { BrowserMessageReader, BrowserMessageWriter, createConnection } from 'vscode-languageserver/browser';
import { createHelloWorldServices } from './hello-world-module';
import { URI } from 'vscode-uri';

declare const self: DedicatedWorkerGlobalScope;
console.log("a")
const messageReader = new BrowserMessageReader(self);
messageReader.listen((m) => console.log("xxx", m))
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared } = createHelloWorldServices({ connection, ...EmptyFileSystem });
const documentBuilder = shared.workspace.DocumentBuilder
const documents = shared.workspace.TextDocuments
const mutex = shared.workspace.MutexLock

async function onDidClose(uri: URI) {
  await mutex.lock(token => documentBuilder.update([], [uri], token))
}

documents.onDidClose(async event => {
    console.log("onDidClose", event.document.uri.toString())
  await onDidClose(URI.parse(event.document.uri))
})

connection.onRequest("custom/clear", async () => {
    documentBuilder.update([], documents.all().map(d => URI.parse(d.uri)), undefined)
    return ""
})

startLanguageServer(shared);
