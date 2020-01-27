import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import { useMessage } from "../hooks/message.hook";

export const CreatePage = () => {
  const history = useHistory();
  const message = useMessage();
  const { token } = useContext(AuthContext);
  const { request, error, clearError } = useHttp();
  const [link, setLink] = useState("");

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const handleChange = event => {
    setLink(event.target.value);
  };

  const handleKeyPress = async event => {
    if (event.key === "Enter") {
      try {
        const data = await request(
          "/api/link/generate",
          "POST",
          { from: link },
          {
            Authorization: `Bearer ${token}`
          }
        );
        setLink("");
        history.push(`/detail/${data.link._id}`);
      } catch (error) {}
    }
  };

  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{ paddingTop: "2rem" }}>
        <div className="input-field">
          <input
            placeholder="Вставьте ссылку"
            id="link"
            type="text"
            onChange={handleChange}
            value={link}
            onKeyPress={handleKeyPress}
          />
          <label htmlFor="link">Введите ссылку</label>
        </div>
      </div>
    </div>
  );
};
// 2:25:28
