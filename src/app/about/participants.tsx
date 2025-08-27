import { PROJECT_PARTICIPANTS } from "@constants/about.constant";

const Participants = () => {
  return (
    <div className="w-full h-full py-14 lg:py-24 mt-20">
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
            {PROJECT_PARTICIPANTS?.map((item: any) => {
              return (
                <>
                  <div className="bg-gray-100 mx-2 my-4 rounded shadow-md">
                    <div className="group w-full flex-wrap flex items-center gap-8  transition-all duration-500 p-4  lg:flex-nowrap ">
                      <div className="text-center lg:text-left lg:max-w-xs flex-1">
                        <div className="mb-5 pb-5 border-b border-solid border-red-300">
                          <h6 className="text-lg text-gray-900 font-semibold mb-1">
                            {item.header}
                          </h6>
                        </div>

                        <p
                          className="text-gray-500 leading-6 mb-7"
                          dangerouslySetInnerHTML={{ __html: item.message }}
                        ></p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participants;
