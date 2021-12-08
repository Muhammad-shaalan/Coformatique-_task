import usersService from "./UsersServices";

const services = {
  Users: usersService,
};

export const ServiceFactory = {
  get: (name) => services[name],
};
