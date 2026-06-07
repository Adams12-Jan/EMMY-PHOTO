/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

type RouterContextType = {
  currentPath: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    // Listen for custom pushstate events
    window.addEventListener('pushstate-navigate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate-navigate', handleLocationChange);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState(null, '', to);
    const navEvent = new CustomEvent('pushstate-navigate');
    window.dispatchEvent(navEvent);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

export function Link({ to, children, ...props }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

// Router Route matcher component
export function Route({ path, element }: { path: string; element: React.ReactNode }) {
  const { currentPath } = useRouter();
  
  // Custom prefix matcher for paths like /admin/*
  if (path.endsWith('/*')) {
    const prefix = path.slice(0, -2);
    if (currentPath.startsWith(prefix)) {
      return <>{element}</>;
    }
  }

  if (currentPath === path) {
    return <>{element}</>;
  }

  return null;
}
