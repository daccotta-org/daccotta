
// import React, { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { createList } from '@/services/userService';

// interface CreateListProps {
//   onClose: () => void;
// }

// const CreateList: React.FC<CreateListProps> = ({ onClose }) => {
//   const [listName, setListName] = useState('');
//   const [description, setDescription] = useState('');
//   const [isPublic, setIsPublic] = useState(false);
  
//   const { user } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     console.log('Creating list...', listName, description, isPublic);

//     try {
//       await createList(user.uid, {
//         name: listName,
//         description,
//         isPublic,
//         list_type: 'user',
//       });
//       onClose(); // Close the drawer after successful creation
//     } catch (error) {
//       console.error('Error creating list:', error);
//       // Handle error (e.g., show error message to user)
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create New List</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="listName" className="block text-sm font-medium text-gray-700">List Name</label>
//           <input
//             type="text"
//             id="listName"
//             value={listName}
//             onChange={(e) => setListName(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             rows={3}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               checked={isPublic}
//               onChange={(e) => setIsPublic(e.target.checked)}
//               className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//             <span className="ml-2 text-sm text-gray-700">Make list public</span>
//           </label>
//         </div>
        
//         <button
//           type="submit"
//           className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Create List
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateList;

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createList } from '@/services/userService';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch" 
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface CreateListProps {
  onClose: () => void;
}

const CreateList: React.FC<CreateListProps> = ({ onClose }) => {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;

    console.log('Creating list...', listName, description, isPublic);

    try {
      await createList(user.uid, {
        name: listName,
        description,
        isPublic,
        list_type: 'user',
      });
      onClose(); // Close the drawer after successful creation
    } catch (error) {
      console.error('Error creating list:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Create New List</DrawerTitle>
          <DrawerDescription>Create a new movie list to share with friends.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="list-name">List Name</Label>
              <Input
                id="list-name"
                placeholder="Enter list name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter list description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public">Make list public</Label>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSubmit}>Create List</Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
};

export default CreateList;