import React from 'react';

/**
* Main Wrapper Component
* It is not intended to be nested within one another.
* Instead, it must be used within another component as a wrapper around its content.
*
* @see {@link https://university.webflow.com/article/container}
*/
const Container = ({ children }) => (
  <main className="container" role="main">
    {children}
  </main>
);

export default Container;