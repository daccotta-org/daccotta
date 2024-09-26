// "use client"

// import { useRouter } from "next/navigation"
// import { useAuth } from "@/hooks/useAuth"
// import { createList } from "@/services/userService"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardContent,
// } from "@/components/ui/card"

// const formSchema = z.object({
//     listName: z.string().min(1, "List name is required"),
//     description: z.string().optional(),
//     isPublic: z.boolean().default(false),
//     isShared: z.boolean().default(false),
// })

// export function CreateListComponent() {
//     const { user } = useAuth()
//     const router = useRouter()

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             listName: "",
//             description: "",
//             isPublic: false,
//             isShared: false,
//         },
//     })

//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         if (!user) return

//         try {
//             await createList(user.uid, {
//                 name: values.listName,
//                 description: values.description,
//                 isPublic: values.isPublic,
//                 isShared: values.isShared,
//                 list_type: "user",
//             })
//             router.push("/profile")
//         } catch (error) {
//             console.error("Error creating list:", error)
//             // Handle error (e.g., show error message to user)
//         }
//     }

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-primary to-secondary p-4">
//             <Card className="w-full max-w-md">
//                 <CardHeader>
//                     <CardTitle>Create New List</CardTitle>
//                     <CardDescription>
//                         Create a new list to organize your items
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <Form {...form}>
//                         <form
//                             onSubmit={form.handleSubmit(onSubmit)}
//                             className="space-y-6"
//                         >
//                             <FormField
//                                 control={form.control}
//                                 name="listName"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>List Name</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 placeholder="Enter list name"
//                                                 {...field}
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="description"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Description</FormLabel>
//                                         <FormControl>
//                                             <Textarea
//                                                 placeholder="Enter list description"
//                                                 {...field}
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="isPublic"
//                                 render={({ field }) => (
//                                     <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                                         <FormControl>
//                                             <Checkbox
//                                                 checked={field.value}
//                                                 onCheckedChange={field.onChange}
//                                             />
//                                         </FormControl>
//                                         <div className="space-y-1 leading-none">
//                                             <FormLabel>
//                                                 Make list public
//                                             </FormLabel>
//                                             <FormDescription>
//                                                 Allow others to view this list
//                                             </FormDescription>
//                                         </div>
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="isShared"
//                                 render={({ field }) => (
//                                     <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                                         <FormControl>
//                                             <Checkbox
//                                                 checked={field.value}
//                                                 onCheckedChange={field.onChange}
//                                             />
//                                         </FormControl>
//                                         <div className="space-y-1 leading-none">
//                                             <FormLabel>Allow sharing</FormLabel>
//                                             <FormDescription>
//                                                 Enable others to share this list
//                                             </FormDescription>
//                                         </div>
//                                     </FormItem>
//                                 )}
//                             />
//                             <Button type="submit" className="w-full">
//                                 Create List
//                             </Button>
//                         </form>
//                     </Form>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }
