<template>
  <div class="home">
    <div class="bg-success text-white" v-if="successMessage">
      {{ successMessage }}
    </div>
    <div class="bg-danger text-white" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div class="table-responsive">
      <base-table
        class="table align-items-center table-flush"
        :class="type === 'dark' ? 'table-dark' : ''"
        :thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
        tbody-classes="list"
        :data="items"
      >
        <!-- Table Head -->
        <template v-slot:columns>
          <th>#</th>
          <th>Image</th>
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
            <img :alt="row.item.name + 'Image'" :src="row.item.avatar" />
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
              data-bs-toggle="modal"
              data-bs-target="#editModal"
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
    <!-- Modal -->
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
            <h5 class="modal-title" id="editModalLabel">Modal title</h5>
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
    <!-- Modal -->
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
            هل انت متأكد من حذف {{ userDetails.first_name }}-
            {{ userDetails.last_name }} ؟
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              @click="deleteUser(userDetails)"
            >
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
      editModal: false,
      deleteModal: false,
      // Messages
      successMessage: false,
      errorMessage: false,
      userDetails: {},
      first_name: "",
      last_name: "",
      email: "",
      currentIndex: "",
      items: "",
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
    editUser(userData) {
      this.editModal = true;
      this.userDetails = userData;
      this.first_name = userData.first_name;
      this.last_name = userData.last_name;
      this.email = userData.email;
    },
    async updateUser() {
      const formData = {
        first_name: this.userDetails.first_name,
        last_name: this.userDetails.last_name,
        email: this.userDetails.email,
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
        this.successMessage = "Updated Successfully";
        setTimeout(() => {
          this.editModal = false;
        }, 300);
        setTimeout(() => {
          this.successMessage = false;
        }, 3000);
      } else {
        this.errorMessage("Error");
        setTimeout(() => {
          this.errorMessage = false;
        }, 3000);
      }
    },
    async fetchAllItems() {
      const items = await UsersService.getAllItems(this.page);
      this.items = items.data;
      this.page = items.page;
      this.total_pages = items.total_pages;
    },
    confirmDeleteUser(userData) {
      this.deleteModal = true;
      this.userDetails = userData;
    },
    async deleteUser(userDetails) {
      const deleteUsers = await UsersService.deleteUser(userDetails.id);
      if (deleteUsers) {
        this.successMessage = "Deleted Successfully";
        this.deleteModal = false;
        setTimeout(() => {
          this.items.splice(this.items.indexOf(userDetails), 1);
        }, 600);
        setTimeout(() => {
          this.successMessage = false;
        }, 3000);
      } else {
        this.errorMessage("Error");
        setTimeout(() => {
          this.errorMessage = false;
        }, 3000);
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
