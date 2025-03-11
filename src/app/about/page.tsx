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
import ProjectParticipants from "./ProjectParticipants";
import { BASE_URL } from "@constants/config.constant";

const IndexPage = () => {
  const data = TasksConstant.ButtonTask;
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <div className="h-full flex flex-col gap-10">
      <div className="w-full mb-10">
        <div className=" mx-auto h-full sm:p-10">
          <div className="flex px-4 justify-between items-center">
            <div className="flex flex-row gap-4 items-center align-middle">
              <a href="/" className="font-bold text-xl md:text-4xl">
                <IconHome />
              </a>
              <p className="text-xl md:text-4xl font-bold">
                About<span className="ml-2 text-primary">Us</span>
              </p>
            </div>
          </div>

          <div className="w-full h-96 pt-10 rounded-xl">
            <Image
              src={`${BASE_URL}/image/about_title.png`}
              width={500}
              height={500}
              className="w-full h-full object-cover  shadow-2xl rounded-xl"
              alt="brain image"
            />
          </div>
          <div className="container px-4 lg:flex mt-4 items-center h-full">
            <div className="w-full">
              <div className="w-20 h-2 bg-primary my-4"></div>
              <p className="text-xl mb-12 text-gray-800 leading-relaxed font-serif">
                The START project is the result of a collaboration between
                University of Reading, Public Health Foundation of India,
                Birkbeck University of London, Nottingham Trent University, All
                India Institutes of Medical Sciences, Sangath, Indian Institute
                of Technology Bombay and Therapy Box®. This project is funded by
                a{" "}
                <strong>Global Challenge Research Fund Foundation Award</strong>{" "}
                by the <em>Medical Research Council UK</em>. START is a
                scalable, modular and extensible mobile platform that will be
                used to collect parent report and direct child assessment to
                help detect probable cases of <em>ASD</em> in children aged 2-5
                years. Children with <em>ASD</em> on average take longer to
                disengage attention from prior stimuli, and do not prefer{" "}
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
          </div>
        </div>
      </div>
      <ProjectParticipants />
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
