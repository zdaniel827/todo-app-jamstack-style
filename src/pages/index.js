import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./index.module.css";
import Todo from "../component/todo";
import Form from "../component/form";

export default () => {
  const [status, setStatus] = useState("loading");
  const [todos, setTodos] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (status !== "loading") return;

    axios("/api/get-all-todos").then((result) => {
      if (cancelled === true) return;
      if (result.status !== 200) {
        console.error("Error loading todos!");
        console.error(result);
        return;
      }
      setTodos(result.data.todos);
      setStatus("loaded");
    });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const reloadTodos = () => setStatus("loading");

  return (
    <main>
      <h1 className={styles.heading}>JAMStack Todos</h1>
      <Form reloadTodos={reloadTodos} />
      {todos ? (
        <ul className={styles.todos}>
          {todos.map((todo) => (
            <li key={todo._id} className={styles.todo}>
              <Todo todo={todo} reloadTodos={reloadTodos} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.loading}>Loading Todos</p>
      )}
    </main>
  );
};
