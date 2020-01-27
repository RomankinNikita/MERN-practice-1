import React, { useState, useContext, useCallback, useEffect } from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import { LinkList } from "../components/LinkList";

export const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const getLinks = useCallback(async () => {
    try {
      const links = await request("/api/link", "GET", null, {
        Authorization: `Bearer ${token}`
      });
      setLinks(links);
    } catch (error) {}
  }, [token, request]);

  useEffect(() => {
    getLinks();
  }, [getLinks]);

  if (loading) {
    return <Loader />;
  }

  return <>{!loading && links && <LinkList links={links} />}</>;
};
