import dynamic from 'next/dynamic';
import { Page } from '@avsync.live/formation';
import { Search } from 'components/Search/Search';
import React from 'react';

import { ZoomableHierarchyNavigator } from 'components/ZoomableHierarchyNavigator';

const SearchPage = () => {
  return (
    <Page>
      <ZoomableHierarchyNavigator
        flareData={
          {
            name: "Cars",
            children: [
              {
                name: "Sedan",
                children: [
                  {
                    name: "Compact",
                    size: 100,
                  },
                  {
                    name: "Mid-size",
                    size: 90,
                  },
                  {
                    name: "Full-size",
                    size: 80,
                  },
                ],
              },
              {
                name: "SUV",
                children: [
                  {
                    name: "Crossover",
                    children: [
                      {
                        name: "Compact",
                        size: 100,
                      },
                      {
                        name: "Mid-size",
                        size: 90,
                      },
                      {
                        name: "Full-size",
                        size: 80,
                      },
                    ],
                  },
                  {
                    name: "Traditional",
                    children: [
                      {
                        name: "Compact",
                        size: 100,
                      },
                      {
                        name: "Mid-size",
                        size: 90,
                      },
                      {
                        name: "Full-size",
                        size: 80,
                      },
                    ],
                  },
                ],
              },
              {
                name: "Hatchback",
                children: [
                  {
                    name: "Subcompact",
                    size: 100,
                  },
                  {
                    name: "Compact",
                    size: 90,
                  },
                  {
                    name: "Mid-size",
                    size: 80,
                  },
                ],
              },
              {
                name: "Coupe",
                children: [
                  {
                    name: "Compact",
                    size: 100,
                  },
                  {
                    name: "Mid-size",
                    size: 90,
                  },
                  {
                    name: "Full-size",
                    size: 80,
                  },
                ],
              },
              {
                name: "Convertible",
                children: [
                  {
                    name: "Soft-top",
                    size: 100,
                  },
                  {
                    name: "Hardtop",
                    size: 90,
                  },
                ],
              },
            ],
          }
        }
      />
      <Search />
    </Page>
  );
};

export default SearchPage;
