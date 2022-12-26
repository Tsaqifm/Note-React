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
  const [edit, setEdit] = useState({});
  const [massage, setMassage] = useState("");
  const [nameOnTop] = useState(myName());
  const [images, setImage] = useState(null);
  const [today, setDate] = useState(new Date()); // Save the current date to be able to trigger an update

  const day = today.toLocaleDateString("en", { weekday: "long" });
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString("en", { month: "long" })}\n\n`;
  const hour = today.getHours();
  const wish = `Good ${(hour < 12 && "Morning") || (hour < 17 && "Afternoon") || "Evening"}, `;
  const time = today.toLocaleTimeString();

  const generateId = () => {
    return Date.now();
  };

  const saveTodoHandler = (event) => {
    event.preventDefault();
    if (!activity) {
      return setMassage("Set your activity first");
    }
    setMassage("");
    if (edit.id) {
      const updatedTodo = {
        ...edit,
        activity,
      };
      const editTodoIndex = todos.findIndex((todo) => {
        return todo.id === edit.id;
      });
      const updatedTodos = [...todos];
      updatedTodos[editTodoIndex] = updatedTodo;
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return cancelEditHandler();
    }
    setTodos([
      ...todos,
      {
        id: generateId(),
        activity,
        done: false,
      },
    ]);
    setActivity("");
    localStorage.setItem(
      "todos",
      JSON.stringify([
        ...todos,
        {
          id: generateId(),
          activity,
        },
      ])
    );
    setMassage("");
  };

  const removeTodoHandler = (todoId) => {
    const filteredTodos = todos.filter((todo) => {
      return todo.id !== todoId;
    });
    setTodos(filteredTodos);
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
    edit.id && cancelEditHandler();
  };

  const editTodoHandler = (todo) => {
    setActivity(todo.activity);
    setEdit(todo);
  };

  const cancelEditHandler = () => {
    setEdit({});
    setActivity("");
  };

  const doneTodoHandler = (todo) => {
    const updatedTodo = {
      ...todo,
      done: todo.done ? false : true,
    };
    const editTodoIndex = todos.findIndex((currentTodo) => {
      return currentTodo.id === todo.id;
    });
    const updatedTodos = [...todos];
    updatedTodos[editTodoIndex] = updatedTodo;
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const clearAll = () => {
    return localStorage.clear();
  };

  useEffect(() => {
    // get images api from unsplash
    const baseURL = `https://api.unsplash.com/search/photos?orientation=landscape&client_id=6hN8fnzZqqgsodeDa2lYRfzKpBIiG5dLf5-E_DyiyHw&query=${wish}&random`;
    axios.get(baseURL).then((response) => {
      let x = Math.floor(Math.random() * 10 + 1);
      setImage(response.data.results[x].urls.regular);
    });

    // to set time interval in 1 second
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [wish, nameOnTop]);

  return (
    <main className="h-screen w-screen bg-slate-100">
      <div className=" mx-auto h-56 bg-cover bg-center brightness-50 lg:h-72 " style={{ backgroundImage: `url(${images})` }}></div>
      <div className="container relative -top-[110px] flex flex-col items-start justify-center lg:-top-[130px] ">
        <div className="  text-white">
          <h1 className="text-xl font-bold md:mb-2 md:text-2xl lg:text-4xl">
            {wish}
            {nameOnTop}👋
          </h1>
          <time className=" text-[10px] font-normal  md:text-xs lg:text-base">
            {date}
            {time}
          </time>
        </div>
        <div className="flex w-full flex-nowrap justify-center ">
          <div className="mt-2 rounded-lg bg-white p-4 shadow-md  ">
            <form onSubmit={saveTodoHandler}>
              {massage && <h1 className="mb-2 text-red-600">{massage}</h1>}
              <div className="flex flex-col items-end">
                <div>
                  <input
                    className=" w-60 rounded-md px-2 py-1 text-sm shadow-inner drop-shadow-md focus:outline-green-500 md:w-80  md:text-base lg:w-96 lg:text-lg"
                    type="text"
                    value={activity}
                    placeholder="Add Your Activities"
                    onChange={(event) => {
                      setActivity(event.target.value);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <button className="rounded-md border-2 border-green-500 bg-green-500 py-1 px-4 text-sm text-white md:text-base lg:text-lg" type="submit">
                    {edit.id ? "Save" : "Add"}
                  </button>
                  {edit.id && (
                    <button className="ml-4 box-border rounded-md border-2 border-green-500 py-1 px-4 text-sm text-green-500   md:text-base lg:text-lg" onClick={cancelEditHandler}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="container -mt-14">
        <div className="container rounded-md bg-white p-4 shadow-md">
          <h1 className="text-lg font-bold md:text-xl lg:text-2xl">Notes📝</h1>
          {todos.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 ">
              {todos.map((todo) => {
                return (
                  <li key={todo.id} className="flex">
                    <input className=" mr-2 align-middle" type="checkbox" checked={todo.done} onChange={doneTodoHandler.bind(this, todo)} />
                    <div className={` ${todo.done && "text-slate-400"} truncate rounded-md border border-slate-300 px-1 py-1 text-xs md:text-sm lg:text-base`}>{todo.activity}</div>
                    <div className="ml-2 flex gap-2">
                      <button onClick={editTodoHandler.bind(this, todo)}>✏</button>
                      <button onClick={removeTodoHandler.bind(this, todo.id)}>❌</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <h1 className="mt-2 text-xs md:text-sm lg:text-base">yeay, there is no activity right now😁</h1>
          )}
        </div>
      </div>
      <h1 onClick={clearAll} className="absolute bottom-2 right-2 z-20 underline">
        clear all here
      </h1>
    </main>
  );
}

export default App;
