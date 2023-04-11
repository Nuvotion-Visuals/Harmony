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
            name: 'User Experience Design',
            size: 90,
            children: [
              {
                name: 'Research',
                size: 70,
                children: [
                  {
                    name: 'User Interviews',
                    size: 40,
                  },
                  {
                    name: 'Surveys',
                    size: 50,
                  },
                  {
                    name: 'Competitive Analysis',
                    size: 60,
                  },
                  {
                    name: 'Analytics',
                    size: 30,
                  },
                ],
              },
              {
                name: 'Design',
                size: 80,
                children: [
                  {
                    name: 'Information Architecture',
                    size: 75,
                    children: [
                      {
                        name: 'Site Map',
                        size: 45,
                      },
                      {
                        name: 'Content Strategy',
                        size: 60,
                      },
                    ],
                  },
                  {
                    name: 'Interaction Design',
                    size: 85,
                    children: [
                      {
                        name: 'Wireframing',
                        size: 55,
                      },
                      {
                        name: 'Prototyping',
                        size: 70,
                        children: [
                          {
                            name: 'Low-Fidelity Prototype',
                            size: 50,
                          },
                          {
                            name: 'High-Fidelity Prototype',
                            size: 60,
                          },
                        ],
                      },
                      {
                        name: 'Animation Design',
                        size: 35,
                      },
                      {
                        name: 'Microinteraction Design',
                        size: 40,
                      },
                    ],
                  },
                  {
                    name: 'Visual Design',
                    size: 65,
                    children: [
                      {
                        name: 'Brand Identity',
                        size: 55,
                      },
                      {
                        name: 'UI Design',
                        size: 70,
                      },
                      {
                        name: 'Graphic Design',
                        size: 50,
                      },
                      {
                        name: 'Typography',
                        size: 40,
                      },
                      {
                        name: 'Color Theory',
                        size: 30,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Testing',
                size: 50,
                children: [
                  {
                    name: 'Usability Testing',
                    size: 45,
                  },
                  {
                    name: 'A/B Testing',
                    size: 60,
                  },
                  {
                    name: 'Remote Testing',
                    size: 30,
                  },
                  {
                    name: 'Focus Groups',
                    size: 55,
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
