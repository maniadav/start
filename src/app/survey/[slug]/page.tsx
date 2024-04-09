const page = ({ params }: { params: { slug: string } }) => {
  return <div>My Post: {params.slug}</div>;
};

export default page;
