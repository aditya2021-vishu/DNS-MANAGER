import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import "./Style.css";
import axios from 'axios';

function ProjectDSCR() {
  const params = useParams();
  //instancename,domainname,ttl,type
  const[entries,setEntries] = useState([])

  const [entryData, setEntryData] = useState({
    instancename: "",
    domainname: "",
    ttl:"",
    type:""
  });

  const handleChange=(e)=>{
    const{name,value} = e.target;
    setEntryData((prevValue)=>{
      return{
       ...prevValue,
       [name]:value
      }
    });
  }

  const handleClick = (e)=>{
    e.preventDefault();
    try{
        const data = axios.post(
            `http://localhost:5000/api/addRecords`,entryData,{withCredentials:true}
        );
    }
    catch(error){
        console.log(error);
    }
  }

  async function getDomainRecords(){
    try{
        const data = axios.get(
            `http://localhost:5000/api/domainRecords/:${params.dname}`,{withCredentials:true}
        );
        setEntries([...data.data]);
    }
    catch(error){
        console.log(error);
    }
  }

  async function handelDelete(index){
    try{
        const deleteData = {
            fqdn:entries[index].fqdn,type:entries[index].type,ttl:entries[index].ttl,zoneName:params.zname
        }
        await axios.post(
            `http://localhost:5000/api/deleteRecord`,deleteData,{withCredentials:true}
        )
        let ent = entries;
        ent.splice(index,1);
        setEntries([...ent]);
    }
    catch(error){
        console.log(error);
    }
  }
  
  useEffect(()=>{
    getDomainRecords();
  },[]);
  return (
    <div className="pDSCR">
       <h1>{params.pname}</h1>
       <div className="entry">
        <table>
            <tr>
                <th className='thead'>DomainName</th>
                <th className='thead'>Type</th>
                <th className='thead'>FQDN</th>
                <th className='thead'>TTL</th>
                <th className='thead'>IP Address</th>
                <th></th>
            </tr>
            {
                entries &&  entries.map((ele,idx)=>(
                    <tr key={idx}>
                       <td className='tdata'>{ele.domainName}</td>
                       <td className='tdata'>{ele.type}</td>
                       <td className='tdata'>{ele.fqdn}</td>
                       <td className='tdata'>{ele.ttl}</td>
                       <td className='tdata'>{ele.ipAddress}</td>
                       <td className='tdata delete'><i style={{"fontSize":"24px"}} onClick={()=>handelDelete(idx)}><MdDelete/></i></td>
                    </tr>
                ))
            }
        </table>
       </div>
       <div className="addEntry">
        <input type="text" name='instancename' placeholder='Enter Instance Name' />
        <input type="text" name='domainname' placeholder='Enter Domain Name' />
        <input type="text" name='ttl' placeholder='Enter TTL' />
        <input type="text" name='type' placeholder='Enter DNS Type' />
        <button onClick={handleClick}>Add New</button>
       </div>
    </div>
  );
}

export default ProjectDSCR;