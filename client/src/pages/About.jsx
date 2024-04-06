import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-center my-7">
            About BlogHub
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              We discuss a variety of software engineering topics including web
              dev, programming languages, frameworks and more
            </p>
            <p>
              In-depth dives and practical application: We believe in not just
              introducing concepts, but also providing deep dives into specific
              topics. Our blog posts often include code samples, project
              tutorials, and explanations that go beyond the surface level. This
              way, you can not only learn about new technologies but also see
              how to apply them in real-world scenarios.
            </p>
            <p>
              A welcoming community: We foster an open and inclusive community
              where developers of all experience levels can learn from each
              other. Feel free to leave comments on our posts, ask questions,
              and share your own experiences. We encourage interaction and
              believe that the best way to learn is through collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
