"use client";
import { IconHome } from "components/common/Icons";
import Image from "next/image";

const aboutDetails = [
  {
    header: "Medical Research Council",
    message:
      "It is a publicly funded government agency responsible for coordinating and funding medical research in the United Kingdom. Council funded the START project by Global Challenge Research Fund Foundation Award",
  },
  {
    header: "University of Reading",
    message:
      "The University (located in Berkshire, England) was established in 1892 as a public university. The START project runs under the supervision of the School of Psychology and Clinical Language Science and Professor <b>Bhismadev Chakrabarti</b>.",
  },
  {
    header: "Public Health Foundation of India",
    message:
      "PHFI is helping to build institutional and system capacity in India for strengthening education, training, research and policy development in the area of Public Health.<br>Project collaborator: <b>Ph.D Vikram Patel</b>",
  },
  {
    header: "Birkbeck University of London",
    message:
      "Birkbeck College is a public research university located in Bloomsbury, London, England, and was established in 1823.<br>Project collaborators: <b>Mark Johnson</b> and <b>Teodora Gliga</b>",
  },
  {
    header: "Nottingham Trent University",
    message:
      "The university was formed by the amalgamation of many separate institutions of higher education. It originated from the Nottingham Government School of Design founded in 1843.<br>Project collaborators: <b>Matthew Belmonte</b>",
  },
  {
    header: "All India Institutes of Medical Sciences",
    message:
      "The All India Institutes of Medical Sciences (AIIMS) is a group of autonomous public medical colleges of higher education. AIIMS New Delhi, the fore-runner parent excellence institution, was established in 1956.<br>Project collaborators: <b>Sheffali Gulati</b>",
  },
  {
    header: "Sangath",
    message:
      "Sangath is a non-governmental, not-for-profit organisation committed to improving health across the life span by empowering existing community resources to provide appropriate physical, psychological and social therapies.<br>Project collaborators: <b>Gauri Divan</b>",
  },
  {
    header: "Indian Institute of Technology Bombay",
    message:
      "The IIT Bombay is a public engineering institution located in Powai, Mumbai, India. It is the second-oldest (after Indian Institute of Technology Kharagpur) institute of the Indian Institutes of Technology system.<br>Project collaborators: <b>Sharat Chandran</b>",
  },
  {
    header: "Therapy Box",
    message:
      "Therapy Box is a multi award winning software development company, specializing in healthcare and education innovation. We have received numerous international awards for innovation and we bring this expertise in working with universities on complex and special development projects<br>Project participants: <b>Swapnil Gadgil, Rebecca Bright, Nadir Ibrahimov</b>",
  },
];

import { useState } from "react";
import { TasksConstant } from "constants/tasks.constant";
import TaskHome from "components/TaskHome";
import SuspenseWrapper from "components/SuspenseWrapper";

const IndexPage = () => {
  const data = TasksConstant.ButtonTask;
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <div className="">
      <div className="h-full w-full md:h-screen text-black">
        <div className="w-full mb-10 col-span-3 md:col-span-2">
          <div className=" mx-auto h-full sm:p-10">
            <nav className="flex px-4 justify-between items-center">
              <div className="flex flex-row gap-4 items-center align-middle">
                <a href="/" className="font-bold text-xl md:text-4xl">
                  <IconHome />
                </a>
                <p className="text-xl md:text-4xl font-bold">
                  About<span className="ml-2 text-primary">Us</span>
                </p>
              </div>
            </nav>

            <div className="w-full h-auto pt-10">
              <Image
                src="/image/about_title.png"
                width={1000}
                height={1000}
                className="w-full h-full object-cover rounded shadow-2xl"
                alt="brain image"
              />
            </div>
            <header className="container px-4 lg:flex mt-4 items-center h-full">
              <div className="w-full">
                {/* <h1 className="text-4xl lg:text-6xl font-bold">
                  Complete all <span className="text-primary">survey</span> ...
                </h1> */}
                <div className="w-20 h-2 bg-primary my-4"></div>
                <p className="text-xl mb-12 text-gray-800 leading-relaxed font-serif">
                  The START project is the result of a collaboration between
                  University of Reading, Public Health Foundation of India,
                  Birkbeck University of London, Nottingham Trent University,
                  All India Institutes of Medical Sciences, Sangath, Indian
                  Institute of Technology Bombay and Therapy Box®. This project
                  is funded by a{" "}
                  <strong>
                    Global Challenge Research Fund Foundation Award
                  </strong>{" "}
                  by the <em>Medical Research Council UK</em>. START is a
                  scalable, modular and extensible mobile platform that will be
                  used to collect parent report and direct child assessment to
                  help detect probable cases of <em>ASD</em> in children aged
                  2-5 years. Children with <em>ASD</em> on average take longer
                  to disengage attention from prior stimuli, and do not prefer{" "}
                  <em>social stimuli</em> (e.g. <strong>faces</strong>,{" "}
                  <strong>voices</strong>, <strong>gestures</strong>) over
                  non-social ones. The app will build on this knowledge and
                  include assessments for different sensory, perceptual and
                  social-behavioural aspects of autism.{" "}
                  <strong>Eye-tracking</strong>, a promising technology for
                  assessing <em>ASD</em> risk, will be used to measure overt
                  attention as indexed by gaze, while behavioural responses will
                  be recorded via touchscreen.
                </p>
              </div>
            </header>
          </div>
        </div>
      </div>

      <section className="w-full h-full py-14 lg:py-24 mt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-24">
            <h1 className="flex gap-2 mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
              <span className="inline-block">Our</span>
              <span className=" text-primary">Project</span>
              <span className="inline-block">Participants</span>
            </h1>
            <p className="text-lg text-gray-500 text-center pt-4">
              We have collaborated with esteemed...
            </p>
          </div>

          <div className="swiper teamswiper pb-10">
            <div className="w-full justify-center flex flex-wrap ">
              {aboutDetails?.map((item: any) => {
                return (
                  <>
                    <div className="bg-gray-100 mx-2 my-4 rounded shadow-md">
                      <div className="group w-full flex-wrap flex items-center gap-8  transition-all duration-500 p-4  lg:flex-nowrap ">
                        {/* <div className="w-full lg:w-48 h-64">
                          <img
                            src="https://pagedone.io/asset/uploads/1696238786.png"
                            alt="image"
                            className="rounded-2xl h-full object-cover mx-auto lg:mx-0 lg:w-full"
                          ></img>
                        </div> */}
                        <div className="text-center lg:text-left lg:max-w-xs flex-1">
                          <div className="mb-5 pb-5 border-b border-solid border-red-300">
                            <h6 className="text-lg text-gray-900 font-semibold mb-1">
                              {item.header}
                            </h6>
                            {/* <span className="text-sm text-gray-500 group-hover:text-indigo-600">
                              ...
                            </span> */}
                          </div>
                          {/* <p className="text-gray-500 leading-6 mb-7">
                            {item.message}
                          </p> */}
                          <p
                            className="text-gray-500 leading-6 mb-7"
                            dangerouslySetInnerHTML={{ __html: item.message }}
                          ></p>
                          {/* <div className="flex items-center gap-4 justify-center lg:justify-start">
                            <p className="cursor-pointer  text-gray-900 hover:text-white group w-12 h-12 rounded-full flex justify-center items-center bg-gray-100 transition-all duration-500 hover:bg-indigo-600">
                              <svg
                                className="w-5 h-5"
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M18.1139 14.2985L26.3866 4.88892H24.4263L17.2431 13.0591L11.5059 4.88892H4.88867L13.5645 17.2437L4.88867 27.1111H6.84915L14.4348 18.4831L20.4937 27.1111H27.1109L18.1134 14.2985H18.1139ZM15.4288 17.3526L14.5497 16.1223L7.55554 6.333H10.5667L16.2111 14.2333L17.0902 15.4636L24.4272 25.7327H21.416L15.4288 17.3531V17.3526Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </p>
                            <p className="cursor-pointer  text-gray-900 hover:text-white group w-12 h-12 rounded-full flex justify-center items-center bg-gray-100 transition-all duration-500 hover:bg-indigo-600">
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.33716 11.9002C8.33716 9.85475 10.0192 8.19617 12.0947 8.19617C14.1702 8.19617 15.8531 9.85475 15.8531 11.9002C15.8531 13.9456 14.1702 15.6042 12.0947 15.6042C10.0192 15.6042 8.33716 13.9456 8.33716 11.9002ZM6.30543 11.9002C6.30543 15.0513 8.89727 17.6056 12.0947 17.6056C15.2921 17.6056 17.8839 15.0513 17.8839 11.9002C17.8839 8.74906 15.2921 6.19475 12.0947 6.19475C8.89727 6.19475 6.30543 8.74906 6.30543 11.9002ZM16.7602 5.96853C16.7601 6.23224 16.8393 6.49005 16.9879 6.70938C17.1365 6.9287 17.3477 7.09968 17.5949 7.2007C17.842 7.30171 18.1141 7.32822 18.3765 7.27688C18.639 7.22554 18.8801 7.09864 19.0694 6.91225C19.2587 6.72585 19.3876 6.48833 19.4399 6.22971C19.4922 5.97108 19.4656 5.70299 19.3633 5.45931C19.261 5.21563 19.0876 5.00733 18.8652 4.86073C18.6428 4.71414 18.3812 4.63583 18.1137 4.63573H18.1131C17.7544 4.63589 17.4105 4.77635 17.1568 5.02625C16.9032 5.27614 16.7605 5.61505 16.7602 5.96853ZM7.53983 20.9443C6.44063 20.895 5.84318 20.7146 5.44614 20.5621C4.91976 20.3602 4.54419 20.1196 4.14932 19.731C3.75444 19.3424 3.51002 18.9726 3.30599 18.4539C3.15122 18.0627 2.96812 17.4738 2.91816 16.3905C2.8635 15.2193 2.85258 14.8675 2.85258 11.9003C2.85258 8.93306 2.8644 8.58222 2.91816 7.41004C2.96821 6.32675 3.15266 5.73893 3.30599 5.34666C3.51092 4.82791 3.75498 4.45777 4.14932 4.06862C4.54365 3.67946 4.91886 3.43857 5.44614 3.23751C5.843 3.08497 6.44063 2.90453 7.53983 2.85528C8.72824 2.80142 9.08523 2.79066 12.0947 2.79066C15.1041 2.79066 15.4615 2.80231 16.6509 2.85528C17.7501 2.90462 18.3465 3.0864 18.7446 3.23751C19.2709 3.43857 19.6465 3.68 20.0414 4.06862C20.4363 4.45724 20.6798 4.82791 20.8847 5.34666C21.0395 5.73777 21.2226 6.32675 21.2726 7.41004C21.3272 8.58222 21.3381 8.93306 21.3381 11.9003C21.3381 14.8675 21.3272 15.2183 21.2726 16.3905C21.2225 17.4738 21.0385 18.0626 20.8847 18.4539C20.6798 18.9726 20.4357 19.3428 20.0414 19.731C19.6471 20.1193 19.2709 20.3602 18.7446 20.5621C18.3477 20.7147 17.7501 20.8951 16.6509 20.9443C15.4625 20.9982 15.1055 21.009 12.0947 21.009C9.08388 21.009 8.72788 20.9982 7.53983 20.9443ZM7.44648 0.856351C6.24626 0.910218 5.42612 1.09777 4.70988 1.37244C3.96812 1.65608 3.34018 2.03662 2.71269 2.65404C2.08521 3.27146 1.70007 3.89128 1.41226 4.62231C1.13356 5.32862 0.943248 6.13644 0.88859 7.31928C0.83303 8.504 0.820312 8.88275 0.820312 11.9002C0.820312 14.9176 0.83303 15.2964 0.88859 16.4811C0.943248 17.664 1.13356 18.4717 1.41226 19.178C1.70007 19.9086 2.0853 20.5292 2.71269 21.1463C3.34009 21.7635 3.96812 22.1435 4.70988 22.4279C5.42747 22.7026 6.24626 22.8901 7.44648 22.944C8.64923 22.9979 9.03292 23.0113 12.0947 23.0113C15.1564 23.0113 15.5408 22.9987 16.7429 22.944C17.9432 22.8901 18.7628 22.7026 19.4795 22.4279C20.2208 22.1435 20.8492 21.7637 21.4767 21.1463C22.1041 20.5289 22.4885 19.9086 22.7771 19.178C23.0558 18.4717 23.247 17.6639 23.3008 16.4811C23.3554 15.2955 23.3681 14.9176 23.3681 11.9002C23.3681 8.88275 23.3554 8.504 23.3008 7.31928C23.2461 6.13635 23.0558 5.32817 22.7771 4.62231C22.4885 3.89173 22.1032 3.27244 21.4767 2.65404C20.8502 2.03564 20.2208 1.65608 19.4804 1.37244C18.7628 1.09777 17.9431 0.909329 16.7438 0.856351C15.5417 0.802485 15.1573 0.789062 12.0956 0.789062C9.03382 0.789062 8.64923 0.801596 7.44648 0.856351Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </p>
                            <p className="cursor-pointer  text-gray-900 hover:text-white group w-12 h-12 rounded-full flex justify-center items-center bg-gray-100 transition-all duration-500 hover:bg-indigo-600">
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 20 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5.00626 18.8859V6.59092H0.909448V18.8859H5.00669H5.00626ZM2.95871 4.91254C4.38705 4.91254 5.27629 3.96844 5.27629 2.78857C5.24956 1.58182 4.38705 0.664062 2.98587 0.664062C1.58373 0.664062 0.667969 1.58182 0.667969 2.78846C0.667969 3.96833 1.55689 4.91244 2.93187 4.91244H2.95839L2.95871 4.91254ZM7.2739 18.8859H11.3704V12.0205C11.3704 11.6536 11.3971 11.2856 11.5054 11.0235C11.8014 10.289 12.4754 9.52875 13.6074 9.52875C15.0895 9.52875 15.6827 10.6561 15.6827 12.3091V18.8859H19.7791V11.8363C19.7791 8.05999 17.7583 6.30267 15.063 6.30267C12.8532 6.30267 11.8827 7.53471 11.3434 8.37384H11.3707V6.59135H7.27412C7.32759 7.74476 7.27379 18.8863 7.27379 18.8863L7.2739 18.8859Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </p>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>

            {/* <button
              id="slider-button-left"
              className="swiper-button-prev p-2.5 group flex justify-center items-center text-gray-900 w-12 h-12 transition-all duration-500 rounded-full hover:text-indigo-600"
              data-carousel-prev
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M8.38413 15.1022L3.33301 10.0511M3.33301 10.0511L8.38413 5M3.33301 10.0511L18.3329 10.0511"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              id="slider-button-right"
              className="swiper-button-next p-2.5 group flex justify-center items-center text-gray-900 w-12 h-12 transition-all duration-500 rounded-full hover:text-indigo-600"
              data-carousel-next
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M11.6158 5L16.6669 10.0511M16.6669 10.0511L11.6158 15.1022M16.6669 10.0511L1.66699 10.0511"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default function Page() {
  return (
    <SuspenseWrapper>
      <IndexPage />
    </SuspenseWrapper>
  );
}
