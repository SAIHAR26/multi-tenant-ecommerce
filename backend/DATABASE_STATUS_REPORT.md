# DATABASE STATUS REPORT

| Collection    | Records | Relationships                     | Issues                              | Fixed |
|---------------|----------|-----------------------------------|-------------------------------------|-------|
| Users         | 31       | Orders, Cart, Wishlist, Reviews   | Customer approvalStatus pending     | Yes   |
| Products      | 50       | Stores, Vendors, Orders, Reviews  | Some optional fields empty          | Yes   |
| Orders        | 30       | Users, Products, Payments         | No major issues                     | Yes   |
| Stores        | 10       | Vendors, Products                 | No major issues                     | Yes   |
| Reviews       | 25       | Users, Products                   | Review images empty                 | Yes   |
| Notifications | 20       | Users                             | No major issues                     | Yes   |
| Wishlist      | 10       | Users, Products                   | No major issues                     | Yes   |
| Cart          | 10       | Users, Products                   | No major issues                     | Yes   |
| Payments      | 30       | Orders                            | Payment enum issue resolved         | Yes   |
| Segments      | 2        | Users                             | No major issues                     | Yes   |
