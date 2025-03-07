import { DefaultDocumentBuilder } from "langium";
import { CancellationToken } from "vscode-languageclient";
import { URI } from 'vscode-uri';
export class HelloWorldDocumentBuilder extends DefaultDocumentBuilder {

    override async update(changed: URI[], deleted: URI[], cancelToken = CancellationToken.None): Promise<void> {
        console.log("update: changed:", changed.map(uri => uri.toString()), "deleted:", deleted.map(uri => uri.toString()));
        await super.update(changed, deleted, cancelToken);
    }

}