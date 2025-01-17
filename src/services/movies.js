import axios from "axios";

class MovieDataService {
    //getAll returns all the movies for a particular page (default page request is 0)
    getAll(page = 0) {
        return axios.get(`https://movie-reviews-w2tk.onrender.com/api/v1/movies?page=${page}`)
    }
    //get(id) gets the specific movie with the supplied
    get(id) {
        return axios.get(`https://movie-reviews-w2tk.onrender.com/api/v1/movies/id/${id}`)
    }

    //searches for movie using user-entered details
    find(query, by = "title", page = 0, rating) {
        return axios.get(
            `https://movie-reviews-w2tk.onrender.com/api/v1/movies?${by}=${query}&page=${page}&rating=${rating}`)
    }
    //Reviews services
    createReview(data) {
        return axios.post("https://movie-reviews-w2tk.onrender.com/api/v1/movies/review", data)
    }

    updateReview(data) {
        return axios.put("https://movie-reviews-w2tk.onrender.com/api/v1/movies/review", data)
    }

    deleteReview(id, userId) {
        return axios.delete(
            "https://movie-reviews-w2tk.onrender.com/api/v1/movies/review",
            { data: { review_id: id, user_id: userId } }
        )
    }

    getRatings() {
        return axios.get("https://movie-reviews-w2tk.onrender.com/api/v1/movies/ratings")
    }
}

const movieDataService = new MovieDataService();

export default movieDataService;