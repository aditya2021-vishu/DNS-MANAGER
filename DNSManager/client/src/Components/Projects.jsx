import React,{useState,useEffect} from "react";
import { Link ,useNavigate} from "react-router-dom";
import "./Style.css";
import { FaExternalLinkAlt } from "react-icons/fa";
import axios from 'axios';

function Projects(){
      const navigate = useNavigate();
      const[projectList,setProjectList] = useState([]);
      const [projectData, setProjectData] = useState({
          domainName: "",
          zoneName: "",
      });
  
      const handleChange=(e)=>{
        const{name,value} = e.target;
        setProjectData((prevValue)=>{
          return{
           ...prevValue,
           [name]:value
          }
        });
      }

      
    const handleSubmit = async (e) => {
        e.preventDefault();
        try { 
            const {data} = await axios.post(
                `http://localhost:5000/api/createProject`,projectData,{withCredentials:true}
            );
            setProjectList((prevValue)=>{
              return[{
                ...prevValue,
                domainName:projectData.domainName,
                zoneName:projectData.zoneName
              }]
            })
        } catch (error) {
          console.log(error);
        }
    };

    async function getProjectRecords(){
      try{
        const data = axios.get(
          `http://localhost:5000/api/getProjects`,{withCredentials:true}
        );
        setProjectList([...data.data]);
      }
      catch(error){
        console.log(error);
      }
    }

    useEffect(()=>{
      getProjectRecords();
    },[]);
    return(
      <div className="project">
        <h1>PROJECTS</h1>
        <div className="projName">
          {
            projectList && projectList.map((obj,idx)=>(
               <div key={idx}>
                <p className="pcon"><Link to={`/home/${obj.domainName}/${obj.zoneName}`} >{obj.zoneName} <i><FaExternalLinkAlt/></i></Link></p>
               </div>
            ))
          }
        </div>
        <div className="addproj">
          <input type="text" name="domainName" placeholder="Enter Domain Name" onChange={handleChange}/>
          <input type="text" name="zoneName" placeholder="Enter Zone Name" onChange={handleChange}/>
          <button onClick={handleSubmit}>Add</button>
        </div>
      </div>
    );
}

export default Projects;