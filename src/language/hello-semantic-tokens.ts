import { AbstractSemanticTokenProvider, AstNode, SemanticTokenAcceptor, flattenCst } from "langium";
import { isKeyword } from "langium/lib/grammar/generated/ast";
import { SemanticTokenTypes } from "vscode-languageserver";

export class HelloSemanticTokenProvider extends AbstractSemanticTokenProvider {
    protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void | "prune" | undefined {
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