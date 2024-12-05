import { useEffect, useRef, useState } from "react";
import './ListProjects.css'
import { fetchUrl, tableHeadings } from "../Constants/ListProjectsConstants";

export default function ListProjects() {

    const [isLoading, setLoading] = useState(true);
    const [currentPageNo, setCurrentPageNo] = useState(1);
    let listOfProjects = useRef([]);

    useEffect(()=>{
        fetch(fetchUrl).then(async(data)=>{
            listOfProjects.current = await data.json();
            setLoading(false);
        })
    },[]);

    function handlePageClick(event) {
        setCurrentPageNo(Number(event.currentTarget.innerText));
    }

    function renderPagination() {
        const noOfProjects = listOfProjects.current.length, noOfPages = noOfProjects/5 + (noOfProjects%5 ? 1 : 0 ),
        paginationContent = [];
    
        for(let i=1;i<=noOfPages; i++) {
            paginationContent.push(<button className="button-paginate" data-testid={i} onClick={handlePageClick} disabled={currentPageNo === i}>{i}</button>)
        }
        return paginationContent;
    }

    function renderCurrentPage() {
        
        const startIndex = 5*(currentPageNo-1), endIndex = 5*currentPageNo, currentPageContent = listOfProjects.current.slice(startIndex, endIndex)
        return <tbody> {currentPageContent.map((project) =>{
            return <tr>
              <td>{project["s.no"]}</td>
              <td>{project["percentage.funded"]}</td>
              <td>{project["amt.pledged"]}</td>
            </tr>

         })} </tbody>
    }

    return <div className="table-container">
        {isLoading? <div className="loader" data-testid="loader" />: (<><table className="table-content">
            <caption className="table-caption" data-testid="tableCaption" > Highly-rated kickstarter projects </caption>
        <thead><tr>{ tableHeadings.map((heading) => { return <th> {heading} </th> }) }</tr> </thead>
       {currentPageNo && renderCurrentPage()}
       </table>
       <div className="pagination"> {renderPagination()}</div> </>)}

       </div>
}






