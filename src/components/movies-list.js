import React, { useState, useEffect } from 'react';
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';


const MoviesList = props => {

   const [movies, setMovies] = useState([]);
   //searchTitle and searchRating keep track of what a user enters in search form
   const [searchTitle, setSearchTitle] = useState("");
   const [searchRating, setSearchRating] = useState("");
   //by defualt rating is All Ratings
   const [ratings, setRatings] = useState(["All Ratings"]);
   //keep track of current page shown
   const [currentPage, setCurrentPage] = useState(0);
   //particular page
   const [entriesPerPage, setEntriesPerPage] = useState(0);
   //can findByTitle or by Rating
   const [currentSearchMode, setCurrentSearchMode] = useState("");

   useEffect(() => {
      setCurrentPage(0)
      //page is changed and can be filtered according to title
   }, [currentSearchMode])

   //retrieveNextPage is rendered only once
   useEffect(() => {
      // retrieveMovies()
      retrieveNextPage()
      //passing current page
   }, [currentPage])

   //using if logic to invoke functions
   const retrieveNextPage = () => {
      if (currentSearchMode === 'findByTitle')
         findByTitle()
      else if (currentSearchMode === 'findByRating')
         findByRating()
      else
         retrieveMovies()
   }

   useEffect(() => {
      retrieveMovies()
      retrieveRatings()
      //empty array used to invoke functions only once
   }, [])


   const retrieveMovies = () => {
      setCurrentSearchMode("")
      MovieDataService.getAll(currentPage)
         .then(response => {
            console.log(response.data)
            setMovies(response.data.movies) // assign to movies state
            setCurrentPage(response.data.page)
            setEntriesPerPage(response.data.entries_per_page)
         })
         .catch(e => {
            console.log(e)
         })
   }

   const retrieveRatings = () => {
      MovieDataService.getRatings()
         .then(response => {
            console.log(response.data)
            //set AllRatings as default
            setRatings(["All Ratings"].concat(response.data))
         })
         .catch(e => {
            console.log(e)
         })
   }

   //called whenever user types in the searchTitle field
   const onChangeSearchTitle = e => {
      const searchTitle = e.target.value
      //then take the entered value and set it to the component state
      setSearchTitle(searchTitle);
   }
   //called whenever user types in the searchRating field
   const onChangeSearchRating = e => {
      const searchRating = e.target.value
      //then take the entered value and set it to the component state
      setSearchRating(searchRating);
   }



   const find = (query, by) => {
      MovieDataService.find(query, by, currentPage)
         .then(response => {
            console.log(response.data)
            setMovies(response.data.movies)
         })
         .catch(e => {
            console.log(e)
         })
   }
   // find function sypported by below two methods
   const findByTitle = () => {
      setCurrentSearchMode("findByTitle")
      find(searchTitle, "title")// Pass the searchTitle and currentPage to the API call
   }

   const findByRating = () => {
      setCurrentSearchMode("findByRating")
      if (searchRating === "All Ratings") {
         retrieveMovies()
      }
      else {
         find(searchRating, "rated")
      }
   }

   return (
      <div className="App">
         <Container>
            <Form>
               <Row>
                  <Col>
                     <Form.Group>
                        <Form.Control
                           type="text"
                           placeholder="Search by title"
                           value={searchTitle}
                           onChange={onChangeSearchTitle}
                        />
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByTitle}
                     >
                        Search
                     </Button>
                  </Col>
                  <Col>
                     <Form.Group>
                        <Form.Control as="select" onChange={onChangeSearchRating} >
                           {ratings.map(rating => {
                              return (
                                 <option value={rating}>{rating}</option>
                              )
                           })}
                        </Form.Control>
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByRating}
                     >
                        Search
                     </Button>
                  </Col>
               </Row>
            </Form>

            <Row>
               {movies.map((movie) => {
                  return (
                     <Col>
                        <Card style={{ width: '18rem' }}>
                           <Card.Img src={movie.poster + "/100px180"} />
                           <Card.Body>
                              <Card.Title>{movie.title}</Card.Title>
                              <Card.Text>
                                 Rating: {movie.rated}
                              </Card.Text>
                              <Card.Text>
                                 {movie.plot}
                              </Card.Text>
                              <Link to={"/movies/" + movie._id} >View Reviews</Link>
                           </Card.Body>
                        </Card>
                     </Col>
                  )
               })}
            </Row>

         </Container><br />
         {/* ch 23 */}
         Showing page: {currentPage}
         <Button
            variant="link"
            onClick={() => { setCurrentPage(currentPage + 1) }}
         >
            Get next {entriesPerPage} results
         </Button>
      </div>
   );
}


export default MoviesList;



