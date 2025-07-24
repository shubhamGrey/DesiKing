using Agronexis.DataAccess.DbContexts;
using Agronexis.ExternalApi;
using Agronexis.Model.EntityModel;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.X509;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Agronexis.DataAccess.ConfigurationsRepository
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly ExternalUtility _externalUtility;
        public ConfigurationRepository(AppDbContext dbContext, IConfiguration configuration, ExternalUtility externalUtility)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _externalUtility = externalUtility;
        }
        public List<ProductResponseModel> GetProducts(string xCorrelationId)
        {
            List<ProductResponseModel> productList = _dbContext.Products
                .Where(x => x.IsActive)
                .Join(_dbContext.Categories,
                      product => product.CategoryId,
                      category => category.Id,
                      (product, category) => new { product, category })
                .AsEnumerable()
                .Select(x => new ProductResponseModel
                {
                    Id = x.product.Id,
                    Name = x.product.Name,
                    Description = x.product.Description,
                    ManufacturingDate = x.product.ManufacturingDate,
                    ImageUrls = JsonSerializer.Deserialize<List<string>>(x.product.ImageUrls),
                    KeyFeatures = JsonSerializer.Deserialize<List<string>>(x.product.KeyFeatures),
                    Uses = JsonSerializer.Deserialize<List<string>>(x.product.Uses),
                    CategoryId = x.product.CategoryId,
                    CategoryName = x.category.Name,
                    BrandId = x.product.BrandId,
                    MetaTitle = x.product.MetaTitle,
                    MetaDescription = x.product.MetaDescription,
                    CreatedDate = DateTime.UtcNow,
                    Origin = x.product.Origin,
                    ShelfLife = x.product.ShelfLife,
                    StorageInstructions = x.product.StorageInstructions,
                    Certifications = JsonSerializer.Deserialize<List<string>>(x.product.Certifications),
                    IsActive = x.product.IsActive,
                    IsPremium = x.product.IsPremium,
                    IsFeatured = x.product.IsFeatured,
                    Ingredients = x.product.Ingredients,
                    NutritionalInfo = x.product.NutritionalInfo,
                    ThumbnailUrl = x.product.ThumbnailUrl
                }).ToList();

            return productList;
        }

        public ProductResponseModel GetProductById(string id, string xCorrelationId)
        {
            ProductResponseModel product = _dbContext.Products.Where(x => x.Id == new Guid(id)).Join(_dbContext.Categories,
                      product => product.CategoryId,
                      category => category.Id,
                      (product, category) => new { product, category }).AsEnumerable().Select(x => new ProductResponseModel
                      {
                          Id = x.product.Id,
                          Name = x.product.Name,
                          Description = x.product.Description,
                          ManufacturingDate = x.product.ManufacturingDate,
                          ImageUrls = JsonSerializer.Deserialize<List<string>>(x.product.ImageUrls),
                          KeyFeatures = JsonSerializer.Deserialize<List<string>>(x.product.KeyFeatures),
                          Uses = JsonSerializer.Deserialize<List<string>>(x.product.Uses),
                          CategoryId = x.product.CategoryId,
                          CategoryName = x.category.Name,
                          BrandId = x.product.BrandId,
                          MetaTitle = x.product.MetaTitle,
                          MetaDescription = x.product.MetaDescription,
                          CreatedDate = DateTime.UtcNow,
                          Origin = x.product.Origin,
                          ShelfLife = x.product.ShelfLife,
                          StorageInstructions = x.product.StorageInstructions,
                          Certifications = JsonSerializer.Deserialize<List<string>>(x.product.Certifications),
                          IsActive = x.product.IsActive,
                          IsPremium = x.product.IsPremium,
                          IsFeatured = x.product.IsFeatured,
                          Ingredients = x.product.Ingredients,
                          NutritionalInfo = x.product.NutritionalInfo,
                          ThumbnailUrl = x.product.ThumbnailUrl
                      }).FirstOrDefault();

            return product;
        }

        public List<ProductResponseModel> GetProductsByCategory(string categoryId, string xCorrelationId)
        {
            List<ProductResponseModel> productList = _dbContext.Products
                .Where(x => x.IsActive && x.CategoryId == new Guid(categoryId))
                .Join(_dbContext.Categories,
                      product => product.CategoryId,
                      category => category.Id,
                      (product, category) => new { product, category })
                .AsEnumerable()
                .Select(x => new ProductResponseModel
                {
                    Id = x.product.Id,
                    Name = x.product.Name,
                    Description = x.product.Description,
                    ManufacturingDate = x.product.ManufacturingDate,
                    ImageUrls = JsonSerializer.Deserialize<List<string>>(x.product.ImageUrls),
                    KeyFeatures = JsonSerializer.Deserialize<List<string>>(x.product.KeyFeatures),
                    Uses = JsonSerializer.Deserialize<List<string>>(x.product.Uses),
                    CategoryId = x.product.CategoryId,
                    CategoryName = x.category.Name,
                    BrandId = x.product.BrandId,
                    MetaTitle = x.product.MetaTitle,
                    MetaDescription = x.product.MetaDescription,
                    CreatedDate = DateTime.UtcNow,
                    Origin = x.product.Origin,
                    ShelfLife = x.product.ShelfLife,
                    StorageInstructions = x.product.StorageInstructions,
                    Certifications = JsonSerializer.Deserialize<List<string>>(x.product.Certifications),
                    IsActive = x.product.IsActive,
                    IsPremium = x.product.IsPremium,
                    IsFeatured = x.product.IsFeatured,
                    Ingredients = x.product.Ingredients,
                    NutritionalInfo = x.product.NutritionalInfo
                }).ToList();

            return productList;
        }

        public string SaveOrUpdateProduct(ProductRequestModel productReq, string xCorrelationId)
        {
            var productDetail = _dbContext.Products.FirstOrDefault(x => x.Id == productReq.Id);

            if (productDetail == null)
            {
                productDetail = new()
                {
                    Name = productReq.Name,
                    Description = productReq.Description,
                    ManufacturingDate = productReq.ManufacturingDate,
                    ImageUrls = JsonSerializer.Serialize(productReq.ImageUrls),
                    KeyFeatures = JsonSerializer.Serialize(productReq.KeyFeatures),
                    Uses = JsonSerializer.Serialize(productReq.Uses),
                    CategoryId = productReq.CategoryId,
                    BrandId = productReq.BrandId,
                    MetaTitle = productReq.MetaTitle,
                    MetaDescription = productReq.MetaDescription,
                    CreatedDate = DateTime.UtcNow,
                    Origin = productReq.Origin,
                    ShelfLife = productReq.ShelfLife,
                    StorageInstructions = productReq.StorageInstructions,
                    Certifications = JsonSerializer.Serialize(productReq.Certifications),
                    IsActive = productReq.IsActive,
                    IsPremium = productReq.IsPremium,
                    IsFeatured = productReq.IsFeatured,
                    Ingredients = productReq.Ingredients,
                    NutritionalInfo = productReq.NutritionalInfo,
                    ThumbnailUrl = productReq.ThumbnailUrl
                };

                _dbContext.Products.Add(productDetail);
            }
            else if (productDetail != null && productDetail.Id == productReq.Id)
            {
                productDetail.Name = productReq.Name;
                productDetail.Description = productReq.Description;
                productDetail.ManufacturingDate = productReq.ManufacturingDate;
                productDetail.ImageUrls = JsonSerializer.Serialize(productReq.ImageUrls);
                productDetail.KeyFeatures = JsonSerializer.Serialize(productReq.KeyFeatures);
                productDetail.Uses = JsonSerializer.Serialize(productReq.Uses);
                productDetail.CategoryId = productReq.CategoryId;
                productDetail.BrandId = productReq.BrandId;
                productDetail.MetaTitle = productReq.MetaTitle;
                productDetail.MetaDescription = productReq.MetaDescription;
                productDetail.CreatedDate = DateTime.UtcNow;
                productDetail.Origin = productReq.Origin;
                productDetail.ShelfLife = productReq.ShelfLife;
                productDetail.StorageInstructions = productReq.StorageInstructions;
                productDetail.Certifications = JsonSerializer.Serialize(productReq.Certifications);
                productDetail.IsActive = productReq.IsActive;
                productDetail.IsPremium = productReq.IsPremium;
                productDetail.IsFeatured = productReq.IsFeatured;
                productDetail.Ingredients = productReq.Ingredients;
                productDetail.NutritionalInfo = productReq.NutritionalInfo;
                productDetail.ThumbnailUrl = productReq.ThumbnailUrl;

                _dbContext.Products.Update(productDetail);
            }
            _dbContext.SaveChanges();
            return productDetail.Id.ToString();
        }

        public string DeleteProductById(string id, string xCorrelationId)
        {
            var productDetail = _dbContext.Products.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

            if (productDetail != null)
            {
                productDetail.IsActive = false;
                productDetail.IsDeleted = true;
                _dbContext.Products.Update(productDetail);
                _dbContext.SaveChanges();
                return "Record deleted successfully.";
            }
            else
            {
                return null;
            }
        }

        public List<CategoryResponseModel> GetCategories(string xCorrelationId)
        {
            List<CategoryResponseModel> categoryList = _dbContext.Categories.Select(x => new CategoryResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                ImageUrl = x.ImageUrl,
                BrandId = x.BrandId,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate,
                MetaTitle = x.MetaTitle,
                MetaDescription = x.MetaDescription
            }).ToList();

            return categoryList;
        }

        public CategoryResponseModel GetCategoryById(string id, string xCorrelationId)
        {
            CategoryResponseModel category = _dbContext.Categories.Where(x => x.Id == new Guid(id)).Select(x => new CategoryResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                ImageUrl = x.ImageUrl,
                BrandId = x.BrandId,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate,
                MetaTitle = x.MetaTitle,
                MetaDescription = x.MetaDescription
            }).FirstOrDefault();

            return category;
        }

        public string SaveOrUpdateCategory(CategoryRequestModel category, string xCorrelationId)
        {
            var categoryDetail = _dbContext.Categories.FirstOrDefault(x => x.Id == category.Id);

            if (categoryDetail == null)
            {
                categoryDetail = new()
                {
                    Name = category.Name,
                    Description = category.Description,
                    ImageUrl = category.ImageUrl,
                    BrandId = category.BrandId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = category.IsActive,
                    MetaTitle = category.MetaTitle,
                    MetaDescription = category.MetaDescription
                };

                _dbContext.Categories.Add(categoryDetail);
            }
            else if (categoryDetail != null && categoryDetail.Id == category.Id)
            {
                categoryDetail.Name = category.Name;
                categoryDetail.Description = category.Description;
                categoryDetail.ImageUrl = category.ImageUrl;
                categoryDetail.BrandId = category.BrandId;
                categoryDetail.ModifiedDate = DateTime.UtcNow;
                categoryDetail.IsActive = category.IsActive;
                categoryDetail.MetaTitle = category.MetaTitle;
                categoryDetail.MetaDescription = category.MetaDescription;

                _dbContext.Categories.Update(categoryDetail);
            }
            _dbContext.SaveChanges();
            return categoryDetail.Id.ToString();
        }

        public string DeleteCategoryById(string id, string xCorrelationId)
        {
            var categoryDetail = _dbContext.Categories.FirstOrDefault(x => x.Id == new Guid(id));

            if (categoryDetail != null)
            {
                categoryDetail.IsActive = false;
                categoryDetail.IsDeleted = true;
                _dbContext.Categories.Update(categoryDetail);
                _dbContext.SaveChanges();
                return "Record deleted successfully.";
            }
            else
            {
                return null;
            }
        }

        public List<BrandResponseModel> GetBrands(string xCorrelationId)
        {
            List<BrandResponseModel> brandList = _dbContext.Brands.Where(x => x.IsActive).Select(x => new BrandResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Code = x.Code,
                Description = x.Description,
                LogoUrl = x.LogoURL,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate,
                MetaTitle = x.MetaTitle,
                MetaDescription = x.MetaDescription
            }).ToList();

            return brandList;
        }

        public BrandResponseModel GetBrandById(string id, string xCorrelationId)
        {
            BrandResponseModel brandDetail = _dbContext.Brands.Where(x => x.Id == new Guid(id)).Select(x => new BrandResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Code = x.Code,
                Description = x.Description,
                LogoUrl = x.LogoURL,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate,
                MetaTitle = x.MetaTitle,
                MetaDescription = x.MetaDescription
            }).FirstOrDefault();

            return brandDetail;
        }

        public string SaveOrUpdateBrand(BrandRequestModel brandReq, string xCorrelationId)
        {
            var brandDetail = _dbContext.Brands.FirstOrDefault(x => x.Id == brandReq.Id);

            if (brandDetail == null)
            {
                brandDetail = new()
                {
                    Name = brandReq.Name,
                    Code = brandReq.Code,
                    Description = brandReq.Description,
                    LogoURL = brandReq.LogoUrl,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = brandReq.IsActive,
                    MetaTitle = brandReq.MetaTitle,
                    MetaDescription = brandReq.MetaDescription
                };

                _dbContext.Brands.Add(brandDetail);
            }
            else if (brandDetail != null && brandDetail.Id == brandReq.Id)
            {
                brandDetail.Name = brandReq.Name;
                brandDetail.Code = brandReq.Code;
                brandDetail.Description = brandReq.Description;
                brandDetail.LogoURL = brandReq.LogoUrl;
                brandDetail.ModifiedDate = DateTime.UtcNow;
                brandDetail.IsActive = brandReq.IsActive;
                brandDetail.MetaTitle = brandReq.MetaTitle;
                brandDetail.Description = brandReq.Description;

                _dbContext.Brands.Update(brandDetail);
            }
            _dbContext.SaveChanges();
            return brandDetail.Id.ToString();
        }

        public string DeleteBrandById(string id, string xCorrelationId)
        {
            var brandDetail = _dbContext.Brands.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

            if (brandDetail != null)
            {
                brandDetail.IsActive = false;
                brandDetail.IsDeleted = true;
                _dbContext.Brands.Update(brandDetail);
                _dbContext.SaveChanges();
                return "Record deleted successfully.";
            }
            else
            {
                return null;
            }
        }

        public List<RoleResponseModel> GetRoles(string xCorrelationId)
        {
            List<RoleResponseModel> roleList = _dbContext.Roles.Where(x => x.IsActive).Select(x => new RoleResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate
            }).ToList();

            return roleList;
        }

        public RoleResponseModel GetRoleById(string id, string xCorrelationId)
        {
            RoleResponseModel roleDetail = _dbContext.Roles.Where(x => x.Id == new Guid(id)).Select(x => new RoleResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate
            }).FirstOrDefault();

            return roleDetail;
        }

        public string SaveOrUpdateRole(RoleRequestModel roleRequest, string xCorrelationId)
        {
            var roleDetail = _dbContext.Roles.FirstOrDefault(x => x.Id == roleRequest.Id);

            if (roleDetail == null)
            {
                roleDetail = new()
                {
                    Name = roleRequest.Name,
                    Description = roleRequest.Description,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = roleRequest.IsActive
                };

                _dbContext.Roles.Add(roleDetail);
            }
            else if (roleDetail != null && roleDetail.Id == roleRequest.Id)
            {
                roleDetail.Name = roleRequest.Name;
                roleDetail.Description = roleRequest.Description;
                roleDetail.ModifiedDate = DateTime.UtcNow;
                roleDetail.IsActive = roleRequest.IsActive;

                _dbContext.Roles.Update(roleDetail);
            }
            _dbContext.SaveChanges();
            return roleDetail.Id.ToString();
        }

        public string DeleteRoleById(string id, string xCorrelationId)
        {
            var roleDetail = _dbContext.Roles.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

            if (roleDetail != null)
            {
                roleDetail.IsActive = false;
                roleDetail.IsDeleted = true;
                _dbContext.Roles.Update(roleDetail);
                _dbContext.SaveChanges();
                return "Record deleted successfully.";
            }
            else
            {
                return null;
            }
        }

        public async Task<LoginResponseModel> UserLogin(LoginRequestModel model, string xCorrelationId)
        {
            var user = await Authenticate(model.Email, model.UserName, model.Password);
            if (user != null)
            {
                return GenerateJwtToken(user);
            }

            return new LoginResponseModel();
        }

        public async Task<RegistrationResponseModel> UserRegistration(RegistrationRequestModel model, string xCorrelationId)
        {
            RegistrationResponseModel signupResponse = new();
            var userExists = await Authenticate(model.Email, model.UserName, model.Password);
            if (userExists == null)
            {
                var user = new User
                {
                    Email = model.Email,
                    UserName = model.UserName,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    MobileNumber = model.MobileNumber,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true,
                    RoleId = model.RoleId
                };

                _dbContext.Users.Add(user);
                _dbContext.SaveChanges();

                signupResponse.RegisteredId = userExists?.Id.ToString();
                signupResponse.Message = "User registered successfully";
            }
            else if (userExists != null)
            {
                signupResponse.RegisteredId = userExists?.Id.ToString();
                signupResponse.Message = "User already exists";
            }

            return signupResponse;
        }

        private async Task<User> Authenticate(string email, string username, string password)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => (u.Email == email || u.UserName == username) && u.IsActive);
            if (user == null) return null;

            bool verified = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return verified ? user : null;
        }

        private LoginResponseModel GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty)
            };

            var accessToken = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:AccessTokenExpiresInMinutes"])),
                signingCredentials: creds
            );

            var refreshToken = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:RefreshTokenExpiresInMinutes"])),
                signingCredentials: creds
            );
            LoginResponseModel loginResponse = new()
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
                RefreshToken = new JwtSecurityTokenHandler().WriteToken(refreshToken)
            };

            return loginResponse;
        }

        public async Task<OrderResponseModel> CreateOrder(OrderRequestModel orderRequest, string xCorrelationId)
        {
            try
            {
                string razorpayOrderId = string.Empty;

                if (orderRequest.PaymentMethod?.ToUpper() == "RAZORPAY")
                {
                    razorpayOrderId = _externalUtility.RazorPayCreateOrder(orderRequest.TotalAmount, orderRequest.Currency);
                }

                var order = new Model.EntityModel.Order
                {
                    Id = Guid.NewGuid(),
                    UserId = orderRequest.UserId,
                    RazorpayOrderId = razorpayOrderId,
                    //ReceiptId = orderRequest.ReceiptId,
                    TotalAmount = orderRequest.TotalAmount,
                    Currency = orderRequest.Currency,
                    Status = orderRequest.Status,
                    CreatedDate = DateTime.UtcNow
                };

                foreach (var item in orderRequest.Items)
                {
                    var orderItem = new OrderItem
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Price = item.Price,
                        CreatedDate = DateTime.UtcNow
                    };

                    order.OrderItems.Add(orderItem);
                }

                _dbContext.Orders.Add(order);
                await _dbContext.SaveChangesAsync();

                OrderResponseModel orderResponse = new()
                {
                    OrderId = order.Id,
                    RazorpayOrderId = razorpayOrderId
                };
                return orderResponse;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool VerifyPayment(VerifyPaymentRequestModel verify, string xCorrelationId)
        {
            bool isVerify = _externalUtility.RazorPayVerifyPayment(verify.OrderId, verify.PaymentId, verify.Signature);
            if (isVerify)
            {
                //insert into transaction table
                var transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = verify.UserId,
                    RazorpayOrderId = verify.OrderId,
                    RazorpayPaymentId = verify.PaymentId,
                    Signature = verify.Signature,
                    TotalAmount = verify.TotalAmount,
                    Currency = verify.Currency,
                    Status = "Paid",
                    PaymentMethod = verify.PaymentMethod,
                    CreatedDate = DateTime.UtcNow
                };
                _dbContext.Transactions.Add(transaction);
                _dbContext.SaveChangesAsync();
            }
            return isVerify;
        }

        public async Task<UserProfileResponseModel> GetUserProfile(Guid userId, string xCorrelationId)
        {
            try
            {
                var user = await _dbContext.Users
                    .Include(u => u.Roles)
                    .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive && !u.IsDeleted);

                if (user == null)
                {
                    return null;
                }

                return new UserProfileResponseModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    MobileNumber = user.MobileNumber,
                    RoleId = user.RoleId,
                    RoleName = user.Roles?.Name,
                    CreatedDate = user.CreatedDate,
                    ModifiedDate = user.ModifiedDate,
                    BrandId = user.BrandId,
                    IsActive = user.IsActive
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetUserProfile: {ex.Message}");
                throw;
            }
        }

        public RefundPaymentResponseModel RefundPayment(RefundPaymentRequestModel refund, string xCorrelationId)
        {
            RefundPaymentResponseModel refundPaymentResponse = _externalUtility.RazorPayRefundPayment(refund.PaymentId, refund.AmountInPaise);
            //insert into transaction table
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = refund.UserId,
                RazorpayOrderId = refund.OrderId,
                RazorpayPaymentId = refund.PaymentId,
                Signature = refund.Signature,
                TotalAmount = (refund.AmountInPaise / 100),
                Currency = refund.Currency,
                Status = "Paid",
                PaymentMethod = refund.PaymentMethod,
                CreatedDate = DateTime.UtcNow
            };
            _dbContext.Transactions.Add(transaction);
            _dbContext.SaveChangesAsync();

            return refundPaymentResponse;
        }
    }
}
