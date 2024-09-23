'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function FriendRequests() {
  const [requests, setRequests] = useState([
    { id: 1, name: 'Vijay Kumar', image: '/placeholder.svg', time: '9w' }
  ])

  const handleConfirm = (id: number) => {
    setRequests(requests.filter(request => request.id !== id))
    // Here you would typically also send a request to your backend to update the friend status
  }

  const handleDelete = (id: number) => {
    setRequests(requests.filter(request => request.id !== id))
    // Here you would typically also send a request to your backend to delete the friend request
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5">
        <div className="flex items-center mb-4">
          <ArrowLeft className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Friends</h2>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Friend requests</h1>
        <p className="text-sm text-gray-600 mb-4">{requests.length} friend request</p>
        <a href="#" className="text-sm text-blue-600 hover:underline">View sent requests</a>
        
        {requests.map(request => (
          <div key={request.id} className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={request.image} alt={request.name} />
                <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{request.name}</p>
                <p className="text-xs text-gray-500">{request.time}</p>
              </div>
            </div>
            <div className="space-x-2">
              <Button 
                onClick={() => handleConfirm(request.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirm
              </Button>
              <Button 
                onClick={() => handleDelete(request.id)}
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}