import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

// to check data todo in local web storag
const data = () => {
  let items = JSON.parse(localStorage.getItem("todos"));
  if (items) {
    return items;
  } else {
    return [];
  }
};

// to check data name in local web storage
const myName = () => {
  let name = localStorage.getItem("name");
  if (name) {
    return name;
  } else {
    const namaSaya = prompt("masukkan nama anda");
    localStorage.setItem("name", namaSaya);
    return namaSaya;
  }
};

function App() {
  const [activity, setActivity] = useState("");
  const [todos, setTodos] = useState(data());
  const [name, setName] = useState(myName());
  const [images, setImage] = useState(null);
  const [today, setDate] = useState(new Date()); // Save the current date to be able to trigger an update

  const day = today.toLocaleDateString("en", { weekday: "long" });
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString("en", { month: "long" })}\n\n`;
  const hour = today.getHours();
  const wish = `Good ${(hour < 12 && "Morning") || (hour < 17 && "Afternoon") || "Evening"}, `;
  const time = today.toLocaleTimeString();

  const addTodoHandler = (event) => {
    event.preventDefault();
    setTodos([...todos, activity]);
    setActivity("");
    localStorage.setItem("todos", JSON.stringify([...todos, activity]));
  };

  useEffect(() => {
    // get images api from unsplash
    const baseURL = `https://api.unsplash.com/search/photos?orientation=landscape&client_id=6hN8fnzZqqgsodeDa2lYRfzKpBIiG5dLf5-E_DyiyHw&query=${wish}&random`;
    axios.get(baseURL).then((response) => {
      let x = Math.floor(Math.random() * 10 + 1);
      setImage(response.data.results[x].urls.full);
    });

    // to check todo list data from local web storage
    const items = JSON.parse(localStorage.getItem("todos"));
    if (items) {
      setTodos(items);
    } else {
      return setTodos([]);
    }
    // to set time interval in 1 second
    // const timer = setInterval(() => {
    //   setDate(new Date());
    // }, 1000);
    // return () => {
    //   clearInterval(timer);
    // };
  }, []);

  return (
    <main className="h-screen w-screen bg-slate-100">
      <div className=" mx-auto h-48 bg-cover bg-center brightness-50 " style={{ backgroundImage: `url(${images})` }}></div>
      <div className="container relative -top-[90px] flex flex-col items-start justify-center ">
        <div className="  text-white">
          <h1 className="text-xl font-bold">
            {wish}
            {name}👋
          </h1>
          <time className="text-[10px] font-normal">
            {date}
            {time}
          </time>
        </div>
        <div className="flex w-full justify-center ">
          <div className="mt-2 rounded-lg bg-white p-4 shadow-md ">
            <form onSubmit={addTodoHandler}>
              <input
                className=" rounded-md px-2 py-1 text-sm shadow-inner drop-shadow-md focus:outline-green-500"
                type="text"
                value={activity}
                placeholder="Add Your Activities"
                onChange={(event) => {
                  setActivity(event.target.value);
                }}
              />
              <button className=" ml-4 rounded-md bg-green-500 py-1 px-4 text-sm text-white" type="submit">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="container -mt-14">
        <div className="container rounded-md bg-white p-4 shadow-md">
          <h1 className="text-lg font-bold">Notes📝</h1>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {todos.map((todo) => {
              return (
                <li className=" rounded-md border border-slate-300 px-2  text-xs line-clamp-4" key={todo}>
                  {todo}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default App;
