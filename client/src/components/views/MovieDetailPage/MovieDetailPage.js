// import { Descriptions,Button,Row} from 'antd';
// import React, { useEffect,useState } from 'react'
// import { API_URL,API_KEY, IMAGE_URL } from '../../Config'
// import MainImage from '../LandingPage/Sections/MainImage';
// import GridCard from '../LandingPage/Sections/GridCard';
// import Favoritef from './Sections/Favoritef';
// /**
// * @author
// * @function MovieDetailPage
// **/

// function MovieDetailPage(props) {
 
  
//   const movieId = props.match.params.movieId; 

//     const [Movie,setMovie] = useState([])
//     const [Crews,setCrews] = useState([])
//     const [ActorToggle, setActorToggle] = useState(false);

//   useEffect(()=>{

//      fetch(`${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`)
//      .then(response=>response.json())
//      .then(response=>{
//        console.log(response)
//        setMovie(response)
     
//      fetch(`${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`)
//        .then(response=>response.json())
//        .then(response=>{
//          console.log(response)
//          setCrews(response.cast)
//        })
//      })
//     },[])

//     const handleClick = ()=>{
//         setActorToggle(!ActorToggle)
//     }

//   return(
//     <div>
//      {
//         Movie &&
//         <MainImage image={`${IMAGE_URL}w1280${Movie.backdrop_path && Movie.backdrop_path }`}
//         title={Movie.original_title} text={Movie.overview} />
//     }

//       <div style={{width:'85%',margin:'1rem auto'}}>
//         <div style={{display:'flex',justifyContent:'flex-end'}}>
//           <Favoritef userFrom={localStorage.getItem('userId')} movieId={movieId} movieInfo={Movie} />
//         </div>


//         <Descriptions title="Movie Info" bordered>
//           <Descriptions.Item label="Title">{Movie.original_title}</Descriptions.Item>
//           <Descriptions.Item label="release_date">{Movie.release_date}</Descriptions.Item>
//           <Descriptions.Item label="revenue">{Movie.revenue}</Descriptions.Item>
//           <Descriptions.Item label="runtime">{Movie.runtime}</Descriptions.Item>
//           <Descriptions.Item label="vote_average" span={2}>
//           {Movie.vote_average}
//           </Descriptions.Item>
//           <Descriptions.Item label="vote_count">{Movie.vote_count}</Descriptions.Item>
//           <Descriptions.Item label="status">{Movie.status}</Descriptions.Item>
//           <Descriptions.Item label="popularity">{Movie.popularity}</Descriptions.Item>
//         </Descriptions>


//        <div style={{display:'flex', justifyContent:'center',marginTop:'5px'}}>
//          <Button onClick={handleClick}>Toggle Actor View</Button>
//        </div>

//        {ActorToggle && 
//           <Row gutter={[16,16]}>
//           {Crews && Crews.map((crew,index)=>(
//                <React.Fragment key={index}>
//                  {crew.profile_path &&
//                   <GridCard 
//                actor image={`${IMAGE_URL}w500${crew.profile_path}`}
//              />
//              }
//                </React.Fragment>
//           ))}
//          </Row> 
//        }



      
//       </div>
    

//     </div> 
//    )

//  }

// export default MovieDetailPage

import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col, Button } from 'antd';
import axios from 'axios';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE } from '../../Config'
import GridCard from '../LandingPage/Sections/GridCard';
import MainImage from '../../views/LandingPage/Sections/MainImage';
 import Favoritef from './Sections/Favoritef';
function MovieDetailPage(props) {

    const movieId = props.match.params.movieId
    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const [LoadingForMovie, setLoadingForMovie] = useState(true)
    const [LoadingForCasts, setLoadingForCasts] = useState(true)
    const [ActorToggle, setActorToggle] = useState(false)
    const movieVariable = {
        movieId: movieId
    }

    useEffect(() => {

        let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
        fetchDetailInfo(endpointForMovieInfo)

        axios.post('/api/comment/getComments', movieVariable)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    console.log('response.data.comments', response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get comments Info')
                }
            })

    }, [])

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    const fetchDetailInfo = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log(result)
                setMovie(result)
                setLoadingForMovie(false)

                let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
                fetch(endpointForCasts)
                    .then(result => result.json())
                    .then(result => {
                        console.log(result)
                        setCasts(result.cast)
                    })

                setLoadingForCasts(false)
            })
            .catch(error => console.error('Error:', error)
            )
    }

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    return (
        <div>
            {/* Header */}
            {!LoadingForMovie ?
                <MainImage
                    image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}
                />
                :
                <div>loading...</div>
            }


            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favoritef movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />
                </div>


              
                <br />
                {/* Actors Grid*/}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <Button onClick={toggleActorView}>Toggle Actor View </Button>
                </div>

                {ActorToggle &&
                    <Row gutter={[16, 16]}>
                        {
                            !LoadingForCasts ? Casts.map((cast, index) => (
                                cast.profile_path &&
                                <GridCard actor image={cast.profile_path} characterName={cast.characterName} />
                            )) :
                                <div>loading...</div>
                        }
                    </Row>
                }
                <br />

          

            </div>

        </div>
    )
}

export default MovieDetailPage