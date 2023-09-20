import { AbstractSemanticTokenProvider, AstNode, SemanticTokenAcceptor, flattenCst, isLeafCstNode } from "langium";
import { isKeyword } from "langium/lib/grammar/generated/ast";
import { SemanticTokenTypes } from "vscode-languageserver";

export class HelloSemanticTokenProvider extends AbstractSemanticTokenProvider {
    protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void | "prune" | undefined {
        console.log("mimimimi3")
        if (node.$cstNode !== undefined && node.$container === undefined) {
            flattenCst(node.$cstNode).forEach ((cst) =>{
                
                if (isKeyword(cst.feature) && "person" !== cst.feature.value) {
                    console.log("HelloSemanticTokenProvider", cst.tokenType.name)
                    acceptor({
                        node: cst.element,
                        keyword: cst.feature.value,
                        type: SemanticTokenTypes.keyword
                    })
                } else if (isLeafCstNode(cst) && "ML_COMMENT" == cst.tokenType.name) {
                    // console.log("HelloSemanticTokenProvider", cst.tokenType.name)
                    // console.log("comment found");
                    // acceptor({
                    //     cst: cst,
                    //     type: SemanticTokenTypes.comment
                    // })
                }
            })
        }
        
    }

}