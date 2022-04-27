<template>
  <div class="home text-start">
    <button
      type="button"
      class="btn btn-success mb-4"
      @click="createModal = true"
    >
      New User
    </button>
    <div class="table-responsive">
      <base-table class="table align-items-center table-flush" :data="items">
        <!-- Table Head -->
        <template v-slot:columns>
          <th>#</th>
          <th>Email</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th class="text-right">action</th>
        </template>

        <!-- Table Body -->
        <template v-slot:default="row">
          <td class="budget">
            {{ row.item.id }}
          </td>
          <td class="budget">
            {{ row.item.email }}
          </td>
          <td class="budget">
            {{ row.item.first_name }}
          </td>
          <td class="budget">
            {{ row.item.last_name }}
          </td>
          <td class="budget text-right">
            <button
              type="button"
              class="btn btn-primary me-2"
              @click="editUser(row.item)"
            >
              Edit
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#deleteModal"
              @click="confirmDeleteUser(row.item)"
            >
              Delete
            </button>
          </td>
        </template>
      </base-table>
      <base-pagination
        :page="page"
        :total_pages="total_pages"
        v-on:pagination-num="page = $event"
      />
    </div>

    <!-- Create Modal -->
    <div
      v-if="createModal"
      class="modal fade show d-block"
      id="createModal"
      tabindex="-1"
      aria-labelledby="createModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createModalLabel">New User</h5>
            <button
              type="button"
              class="btn-close"
              @click="createModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <div class="col-lg-6 mb-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="First Name"
                    v-model="newUser.first_name"
                  />
                </div>
                <div class="col-lg-6 mb-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Last Name"
                    v-model="newUser.last_name"
                  />
                </div>
                <div class="col-lg-6 mb-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Email"
                    v-model="newUser.email"
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="createModal = false"
            >
              Close
            </button>
            <button type="button" class="btn btn-success" @click="createUser()">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Edit Modal -->
    <div
      v-if="editModal"
      class="modal fade show d-block"
      id="editModal"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Edit User</h5>
            <button
              type="button"
              class="btn-close"
              @click="editModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <div class="col-lg-6 mb-3">
                  <input
                    type="text"
                    class="form-control"
                    v-model="first_name"
                  />
                </div>
                <div class="col-lg-6 mb-3">
                  <input type="text" class="form-control" v-model="last_name" />
                </div>
                <div class="col-lg-6 mb-3">
                  <input type="text" class="form-control" v-model="email" />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="editModal = false"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="updateUser(userDetails)"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete Modal -->
    <div
      v-if="deleteModal"
      class="modal fade show d-block"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Delete Modal</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="deleteModal = false"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure to delete {{ userDetails.first_name }}-
            {{ userDetails.last_name }} ?
          </div>
          <div class="modal-footer">
            <button type="button" @click="deleteUser(userDetails)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTable from "@/components/BaseTable.vue";
import BasePagination from "@/components/BasePagination.vue";

import { ServiceFactory } from "../services/ServiceFactory";
const UsersService = ServiceFactory.get("Users");

export default {
  name: "Listing",
  components: {
    BaseTable,
    BasePagination,
  },
  data() {
    return {
      loading: false,
      // Modals
      createModal: false,
      editModal: false,
      deleteModal: false,
      newUser: { first_name: "", last_name: "", email: "" },
      userDetails: {},
      first_name: "",
      last_name: "",
      email: "",
      currentIndex: "",
      items: [],
      page: 1,
      total_pages: "",
    };
  },
  created() {
    this.fetchAllItems();
  },
  watch: {
    page: function () {
      this.fetchAllItems();
    },
  },
  methods: {
    validation: function () {
      if (
        this.newUser.first_name &&
        this.newUser.last_name &&
        this.newUser.email
      ) {
        return true;
      } else {
        return false
      }
    },
    // Create User
    async createUser() {
      if (this.validation) {
        const formData = this.newUser;
        const createUser = await UsersService.createUser(formData);
        if (createUser) {
          this.newUser = {};
          this.items.unshift(createUser);
          this.$swal({
            position: "center",
            icon: "success",
            title: "Created Successfully",
          });
          setTimeout(() => {
            this.createModal = false;
          }, 200);
        } else {
          this.$swal({
            position: "center",
            icon: "error",
            title: "Error",
          });
        }
      } else {
        this.$swal({
          position: "center",
          icon: "error",
          title: "Please Fill All Fields",
        });
      }
    },

    // Update User
    editUser(userData) {
      this.editModal = true;
      this.userDetails = userData;
      this.first_name = userData.first_name;
      this.last_name = userData.last_name;
      this.email = userData.email;
    },
    async updateUser() {
      if (this.first_name && this.last_name && this.email) {
        const formData = {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
        };
        const updateUsers = await UsersService.updataUser(
          this.userDetails.id,
          formData
        );
        if (updateUsers) {
          this.items.filter((item) => {
            if (this.userDetails.id === item.id) {
              item.first_name = this.first_name;
              item.last_name = this.last_name;
              item.email = this.email;
            }
          });
          this.$swal({
            position: "center",
            icon: "success",
            title: "Updated Successfully",
          });
          setTimeout(() => {
            this.editModal = false;
          }, 300);
        } else {
          this.$swal({
            position: "center",
            icon: "error",
            title: "Server Error",
          });
        }
      } else {
        this.first_name = this.userDetails.first_name;
        this.last_name = this.userDetails.last_name;
        this.email = this.userDetails.email;
        this.$swal({
          position: "center",
          icon: "error",
          title: "Please Fill All Fields",
        });
      }
    },

    // Get All Users
    async fetchAllItems() {
      const items = await UsersService.getAllItems(this.page);
      this.items = items.data;
      this.page = items.page;
      this.total_pages = items.total_pages;
    },

    // Delete User
    confirmDeleteUser(userData) {
      this.deleteModal = true;
      this.userDetails = userData;
    },
    async deleteUser(userDetails) {
      const deleteUsers = await UsersService.deleteUser(userDetails.id);
      if (deleteUsers) {
        this.$swal({
          position: "center",
          icon: "success",
          title: "Deleted Successfully",
        });
        this.deleteModal = false;
        setTimeout(() => {
          this.items.splice(this.items.indexOf(userDetails), 1);
        }, 600);
      } else {
        this.$swal({
          position: "center",
          icon: "error",
          title: "Error",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.modal.fade.show {
  background: rgba(0, 0, 0, 0.3);
}
</style>
