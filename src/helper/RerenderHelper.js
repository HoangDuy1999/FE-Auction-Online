import { useEffect } from 'react';
import App from '../App';

export default function useRefresh(history , path, resetRoute = App) {
  let handler;

  const refresh = () => {
    history.push(resetRoute);

    handler = setTimeout(() => history.push(path), 10);
  };

  useEffect(() => {
    return () => handler && clearTimeout(handler);
  }, [handler]);

  return refresh;
}