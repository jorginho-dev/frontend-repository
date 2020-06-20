import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api
      .get("/repositories")
      .then((response) => setRepositories([...response.data]));
  }, []);

  async function handleAddRepository() {
    // TODO
    const response = await api.post("/repositories", {
      title: `New Repository ${Date.now()}`,
      url: "https://github.com/jorginho-dev/frontend-repository",
      techs: ["React.js"],
    });

    const repository = response.data;
    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    // TODO
    await api.delete(`/repositories/${id}`);

    const remainingRepositories = await repositories.filter(
      (repository) => repository.id !== id
    );

    setRepositories([...remainingRepositories]);
  }

  async function handleLikeRepository(id) {
    const { data } = await api.post(`/repositories/${id}/like`);

    const indexRepository = await repositories.findIndex(
      (repository) => repository.id === id
    );

    repositories[indexRepository].likes = data.likes;

    setRepositories([...repositories]);
  }

  return (
    <div className="container">
      <ul data-testid="repository-list" className="content">
        {repositories.map((repository) => (
          <li key={repository.id} className="items">
            <div className="items-header">
              <h3>{repository.title}</h3>
              <button onClick={() => handleLikeRepository(repository.id)}>
                Like
              </button>
            </div>

            <div className="items-footer">
              <p>
                {repository.techs.join(", ")}{" "}
                {repository.likes > 0 ? (
                  <span> {repository.likes + " Likes"} </span>
                ) : (
                  ""
                )}
              </p>
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </div>
          </li>
        ))}

        <button onClick={handleAddRepository}>Adicionar</button>
      </ul>
    </div>
  );
}

export default App;
