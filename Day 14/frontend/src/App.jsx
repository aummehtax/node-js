import axios from "axios"
import { useEffect , useState } from "react"

const App = () => {

  let [jokes ,setJokes] = useState([])

  useEffect(() => {

    axios.get("/api/jokes") // proxy
    .then((res) => {
      setJokes(res.data)
    })
    .catch((err) => {
      console.log(err);
    })

  }, [])

  return (
    <div>
      <h1>Jokes</h1>
      <div>{jokes.length}</div>

      {
        jokes.map((element , index) => {
          return(
            <div key={element.id}>
              <br />
              <div>{element.title}</div>
              <div>{element.content}</div>
              <br />
            </div>
          )
        })
      }
    </div>
  )
}

export default App
