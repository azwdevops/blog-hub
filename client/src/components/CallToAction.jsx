import { Button } from "flowbite-react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn NodeJs?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 10 NodeJs projects
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          Learn More By Building Projects
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://codedamn-blog.s3.amazonaws.com/wp-content/uploads/2022/10/02012225/nodejs.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default CallToAction;
