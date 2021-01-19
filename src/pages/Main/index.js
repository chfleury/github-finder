import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Container, Form, SubmitButton, List } from './styles';
import apiClient from '../../services/apiClient';
class Main extends Component {
  state = {
    search: '',
    repositories: [],
    loading: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({
        repositories: JSON.parse(repositories),
      });
    }
  }
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }
  handleInputChange = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    const { search, repositories } = this.state;

    e.preventDefault();

    this.setState({
      search: '',
      loading: true,
    });

    const response = await apiClient.get(`/repos/${search}`);

    const data = {
      name: response.data.name,
      owner: response.data.owner,
      fullName: response.data.full_name,
    };

    console.log(data.name);

    this.setState({
      repositories: [...repositories, data],
      loading: false,
    });
  };

  render() {
    const { search, repositories, loading } = this.state;

    if (repositories.length > 0) {
      console.log(repositories[0].name);
    }
    return (
      <>
        <Container>
          <h1>
            <FaGithubAlt />
            Repositórios
          </h1>

          <Form onSubmit={this.handleSubmit}>
            <input
              placeholder="Adicionar repositório"
              type="text"
              value={search}
              onChange={this.handleInputChange}
            />

            <SubmitButton disabled={loading}>
              {loading ? (
                <FaSpinner color="#FFF" size="14" />
              ) : (
                <FaPlus color="#FFF" size="14" />
              )}
            </SubmitButton>
          </Form>
        </Container>

        {repositories.length > 0 && (
          <Container>
            <List>
              {repositories.map((repository) => (
                <li key={repository.name}>
                  <span>{repository.name}</span>
                  <Link
                    to={`/repository/${encodeURIComponent(
                      repository.fullName
                    )}`}
                  >
                    Detalhes
                  </Link>
                </li>
              ))}
            </List>
          </Container>
        )}
      </>
    );
  }
}

export default Main;
