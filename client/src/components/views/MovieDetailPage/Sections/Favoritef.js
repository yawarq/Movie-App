import React, { useEffect, useState } from 'react'
import axios from 'axios';


/**
* @author
* @function 
**/

function Favoritef(props){

  const variable ={
    userFrom: props.userFrom ,
    movieId: props.movieId,
    movieTitle: props.movieInfo.original_title,
    movieImage: props.movieInfo.backdrop_path,
  }
  
  

   const [FavoriteNumber, setFavoriteNumber] = useState(0)
   const [Favorited, setFavorited]=useState(false);

  useEffect(()=>{

   
 
    axios.post('/api/favorite/favoriteNumber', variable)
      .then(response=>{
          if(response.data.success){
            setFavoriteNumber(response.data.FavoriteNumber)
          }else{
            alert('Failed to get favoriteNumber');
          }
      })

    axios.post('/api/favorite/favorited',variable)
       .then(response=>{
         if(response.data.success){
              setFavorited(response.data.favorited)
         }else{
           alert('Failed to get Favorite Info')
         }
       })



  },[])


 const onClickFavorite =()=>{
   if(Favorited){
     
    axios.post('/api/favorite/removeFromFavorite', variable)
     .then(response=>{
       if(response.data.success){
           setFavoriteNumber(FavoriteNumber - 1)
           setFavorited(!Favorited)
       }else{
         alert('Failed to remove from  Favorite')
       }
     })


   }else{

    axios.post('/api/favorite/addToFavorite', variable)
     .then(response=>{
       if(response.data.success){
           setFavoriteNumber(FavoriteNumber+ 1)
           setFavorited(!Favorited)
       }else{
         alert('Failed to add to Favorite')
       }
     })

   }

 }


  return(
    <div>
    <button onClick={onClickFavorite}>{Favorited? "Remove from Favourite":"Add To Favourite"}{FavoriteNumber}</button>
    </div>
   )

 }

export default Favoritef