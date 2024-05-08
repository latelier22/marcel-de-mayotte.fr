import ListCitations from "./ListCitations";
import TitleLine from "../../TitleLine"


async function Page() {




    return (
        <>

            <div
                className="pt-64">
                <TitleLine title="GESTION DES CITATIONS" />
            </div>




            <ListCitations />

        </>
    );
};

export default Page;
