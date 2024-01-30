import React,{useState} from "react";
import { MdCreate } from "react-icons/md";
import { FaUpload } from "react-icons/fa";
import Projects from "./Projects";
import "./Style.css";

function Home() {
    const[flag,setFlag] = useState(true);
    return(
        <div className="home">
           {/* Profile */}
           <div className="profile">
             <p>Name</p>
             <button>Logout</button>
           </div>

           {flag ? <div className="main">
             {/* Add new project */}
             <div className="newproj">
                <button onClick={()=>setFlag(false)}>Create New Project <i><MdCreate/></i></button>
             </div>
             {/* Upload Json File */}
             <div className="jsonfile">
                <input type="file" name="file" id="file-input" style={{"display":"none"}}/>
                <div className="lbl">
                <label id="file-input-label" for="file-input">Upload JSON File <i><FaUpload/></i></label>
                </div>
             </div>
           </div> : <Projects/>}
    
        </div>
    );
}

export default Home;