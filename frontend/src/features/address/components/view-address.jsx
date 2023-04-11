import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddressAPI from '../address.api';
import { useAuth } from '../../auth';
import { DescriptionList } from '../../ui/data-display';
import { AddressForm } from '..';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const ViewAddress = () => {
  const [address, setAddress] = useState(null);

  const [jwt] = useAuth();

  const { id } = useParams();
  const navigate = useNavigate();

  const getAddressInfo = async () => {
    try {
      const info = await AddressAPI.getOne(jwt, id);

      console.log('getAddressInfo', info);

      setAddress(info);
    } catch (error) {
      console.log('ViewAddress', error);
    }
  };

  const handleDelete = async () => {
    try {
      await AddressAPI.remove(jwt, address.id);
      console.log('Deleted!');
      navigate('/account/address');
    } catch (error) {
      console.log('ViewAddress handleDelete', error);
    }
  };

  useEffect(() => {
    getAddressInfo();
  }, []);

  if (!id) return <h1>No Id</h1>;

  return (
    <section className='mx-auto w-full max-w-7xl'>
      <div className='mx-auto h-full max-w-2xl'>
        <div className='mb-10 bg-white sm:mt-10 sm:rounded-lg sm:border sm:shadow-md'>
          <div className='flex items-start justify-between border-b border-gray-100 p-4'>
            <div>
              <h3 className='text-lg leading-6 text-gray-900'>
                Address Information
              </h3>
              <p className='text-sm text-gray-500'>
                Personal details and application. lore
              </p>
            </div>
            {/* Actions Buttons */}
            <div className='text-right'>
              <Menu as='div' className='relative inline-block text-left'>
                <div>
                  <Menu.Button className='rounded-md border border-gray-300 p-2 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black '>
                    <EllipsisVerticalIcon
                      className='h-5 w-5 text-black'
                      aria-hidden='true'
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md border border-gray-100 bg-white shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='px-1 py-1 '>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/settings/address/edit/${address.id}`}
                            className={clsx(
                              active
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-900',
                              'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                            )}
                          >
                            <PencilIcon
                              className={clsx(
                                active ? 'text-white' : 'text-violet-500',
                                'mr-2 h-5 w-5'
                              )}
                              aria-hidden='true'
                            />
                            Edit
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={clsx(
                              active
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-900',
                              'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                            )}
                            onClick={handleDelete}
                          >
                            <TrashIcon
                              className={clsx(
                                active ? 'text-white' : 'text-violet-500',
                                'mr-2 h-5 w-5'
                              )}
                              aria-hidden='true'
                            />
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          <div className='border-t border-gray-200'>
            <dl>
              {address &&
                AddressForm.one.map((item) => (
                  <DescriptionList
                    dt={item.label}
                    dd={address[item.name]}
                    key={item.name}
                  />
                ))}

              <div>
                <p className='px-4'>Entre las calles</p>
              </div>
              {address &&
                AddressForm.two.map((item) => (
                  <DescriptionList
                    dt={item.label}
                    dd={address[item.name]}
                    key={item.name}
                  />
                ))}

              {address &&
                AddressForm.three.map((item) => (
                  <DescriptionList
                    dt={item.label}
                    dd={address[item.name]}
                    key={item.name}
                  />
                ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

// bg-gray-100 bg-white

export default ViewAddress;
