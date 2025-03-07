import { AbstractSemanticTokenProvider, AstNode, LangiumServices, SemanticTokenAcceptor, flattenCst } from "langium";
import { isKeyword } from "langium/lib/grammar/generated/ast";
import { SemanticTokenTypes } from "vscode-languageserver";

export class HelloSemanticTokenProvider extends AbstractSemanticTokenProvider {
    services: LangiumServices
    constructor(services: LangiumServices) {
        super(services)
        this.services = services
    }

    protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void | "prune" | undefined {
        console.log(this.services.shared.workspace.LangiumDocuments.all.map(d => d.uri.toString()).toArray())
        console.log("mimimimi3")
        if (node.$cstNode !== undefined && node.$container === undefined) {
            flattenCst(node.$cstNode).forEach ((cst) =>{
                if (isKeyword(cst.feature) && "person" !== cst.feature.value) {
                    acceptor({
                        node: cst.element,
                        keyword: cst.feature.value,
                        type: SemanticTokenTypes.keyword
                    })
                }
            })
        }
        
    }

}