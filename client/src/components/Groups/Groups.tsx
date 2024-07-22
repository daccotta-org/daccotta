import { IGroup } from '../../Types/Group'
import Group from './Group';
type GroupListProps = {
    groups: IGroup[];
};

const Groups = ({ groups }: GroupListProps) => {
   
    return (
      <div className='w-full h-full flex flex-col justify-start items-center p-2 gap-2 overflow-y-auto overflow-x-hidden scrollbar-hide' >
        {groups.map(({id,name,icon}) => (
         <Group key={id} id={id} name={name} icon={icon}/>
        ))}
      </div>
    )
  }
  
  export default Groups