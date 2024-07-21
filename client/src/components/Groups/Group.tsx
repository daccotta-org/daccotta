import React from 'react'
import { IGroup } from '../../Types/Group'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
const Group:React.FC<IGroup> = ({id,icon,name}) => {
 
  const Icon =icon;
  {
  return (
    <motion.div className='tooltip tooltip-right' data-tip={name} >
      <Link to={`/profile/groups/${id}`}>
        <Icon size="56px"/>
      </Link>
    </motion.div>

    
  )
}}

export default Group