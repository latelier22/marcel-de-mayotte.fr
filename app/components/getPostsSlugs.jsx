import axios from 'axios';
import cheerio from 'cheerio';
import { format } from 'date-fns';

const buttonBorderStyle = {
    border: '2px solid #ffcc00',
  };

async function ArticleList({ url }) {
  
  const fetchArticleData = async () => {
    try {
      const response = await axios.get(url);
      const html = response.data;
      
      const $ = cheerio.load(html);
      const blogCards = [];

      // Sélectionnez les éléments HTML correspondant aux articles
      $('article').each((index, element) => {
        const title = $(element).find('h2.entry-title a').text();
        const link = $(element).find('h2.entry-title a').attr('href');
        const description = $(element).find('.entry-summary').text().trim();
        const publishedDate = $(element).find('time.published').attr('datetime');

        // Formater les dates
      const formattedPublishedDate = format(new Date(publishedDate), "d MMMM yyyy");

        // Remplir les données de la carte de blog
        const blogCard = {
          title: title,
          text: description,
          button: "Lire la suite...",
          buttonColor: "",
          link: link,
          url: "", // Pour l'instant pas d'image URL
          alt: "", // Pas d'attribut alt pour l'image
          publishedDate : formattedPublishedDate
        };

        blogCards.push(blogCard);
      });

      return blogCards;
        
    } catch (error) {
      console.error('Erreur lors de la récupération des données des articles :', error);
    }
  };

  const blogCards = await fetchArticleData();

  return (
    <div>
      <div className="flex flex-wrap justify-arround mx-12">
        {blogCards.map((card, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-neutral-200 shadow-lg p-4">
              <h3 className="text-xl dark:text-black text-white font-bold mb-2">{card.title}</h3>
              <p className="text-gray-700 mb-4">{card.publishedDate}</p>
              <p className="text-gray-700 mb-4">{card.text}</p>
              <a href={card.link}
              className={`block text-center text-neutral-800 font-bold py-2 px-4 rounded ${card.buttonColor}`}
              style={buttonBorderStyle}>{card.button}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
