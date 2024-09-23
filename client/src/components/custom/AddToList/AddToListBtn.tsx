type Props = {
    movie_id: string // movie id
    release_date: string
    title: string
    overview: string
    poster_path: string
    backdrop_path: string
}
//api/user/uid/list/list_id/movie_id
//
const AddToListBtn = (props: Props) => {
    return <div>{props.movie_id}</div>
}
export default AddToListBtn
