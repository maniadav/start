"use client";
import Image from "next/image";
import SuspenseWrapper from "components/wrapper/SuspenseWrapper";
import ProjectParticipants from "./participants";
import { BASE_URL } from "@constants/config.constant";

const IndexPage = () => {
  return (
    <div className="h-full flex flex-col gap-10">
      <div className="w-full mb-10">
        <div className=" mx-auto h-full sm:p-10">
          <div className="w-full h-96 pt-12 rounded-xl">
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
