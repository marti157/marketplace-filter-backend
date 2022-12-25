import axios from 'axios';

export const requesters = {
  'motos.net': (endpoint, promises, numPages) => {
    const motoRequest = (config, resolve, results = []) => {
      axios(config)
        .then((response) => {
          results.push(...response.data.items);

          if (
            config.data.pagination.page < response.data.meta.totalPages &&
            config.data.pagination.page < numPages
          ) {
            // eslint-disable-next-line no-param-reassign
            config.data.pagination.page += 1;
            motoRequest(config, resolve, results);
          } else {
            resolve({ data: results, handler: endpoint.handler });
          }
        })
        .catch((err) => console.log('Motos err:', err.message));
    };

    promises.push(
      new Promise((resolve) => {
        motoRequest(
          {
            method: 'post',
            url: 'https://ms-mt--api-web.spain.advgo.net/search',
            data: endpoint.params,
            headers: { 'x-schibsted-tenant': 'motos', 'Accept-Encoding': null },
            timeout: 3000,
          },
          resolve,
        );
      }),
    );
  },

  wallapop: (endpoint, promises, numPages) => {
    const wallapopRequest = (config, resolve, results = []) => {
      axios(config)
        .then((response) => {
          results.push(...response.data.search_objects);

          if (results.length < numPages * 10 && response.headers['x-nextpage']) {
            const newParams = new URLSearchParams(response.headers['x-nextpage']);

            wallapopRequest(
              {
                ...config,
                params: Object.fromEntries(newParams),
              },
              resolve,
              results,
            );
          } else {
            resolve({ data: results, handler: endpoint.handler });
          }
        })
        .catch((err) => console.log('Wallapop err:', err.message));
    };

    promises.push(
      new Promise((resolve) => {
        wallapopRequest(
          {
            method: 'get',
            url: 'https://api.wallapop.com/api/v3/general/search',
            params: endpoint.params,
            timeout: 3000,
          },
          resolve,
        );
      }),
    );
  },
};

export const parsers = {
  'motos.net': (data) =>
    data.map((item) => ({
      id: item.id,
      title: item.title,
      description: `${item.km}km, any ${item.year}, ${item.mainProvince}.\n${item.phone}`,
      location: item.mainProvince,
      price: item.price.amount,
      link: `https://motos.coches.net${item.url}`,
      images: item.resources ? item.resources.map((resource) => resource.url) : [],
      dateCreated: new Date(item.publishedDate),
      dateUpdated: new Date(item.publishedDate),
      new: true,
      removed: false,
    })),

  wallapop: (data) =>
    data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location.city,
      price: item.price,
      link: `https://es.wallapop.com/item/${item.web_slug}`,
      images: item.images.map((image) => image.xsmall),
      dateCreated: new Date(item.creation_date),
      dateUpdated: new Date(item.modification_date),
      new: true,
      removed: false,
    })),
};
