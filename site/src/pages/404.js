import Link from "next/link"

export default function notfound() {
    return (
        <>
            <h1>Página não encontrada :/</h1>
            <Link href="/">Ir para a página principal</Link>
        </>
    )
}