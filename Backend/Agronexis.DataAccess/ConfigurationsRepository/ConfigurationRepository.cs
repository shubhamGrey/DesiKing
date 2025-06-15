using Agronexis.DataAccess.DbContexts;
using Agronexis.Model.EntityModel;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace Agronexis.DataAccess.ConfigurationsRepository
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly AppDbContext _dbContext;
        public ConfigurationRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public List<ProductResponseModel> GetProducts(string xCorrelationId)
        {
            List<ProductResponseModel> productList = _dbContext.Products.Where(x => x.IsActive).Select(x => new ProductResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                Currency = x.Currency,
                ManufacturingDate = x.ManufacturingDate,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted
            }).ToList();

            return productList;
        }

        public ProductResponseModel GetProductById(string id, string xCorrelationId)
        {
            ProductResponseModel product = _dbContext.Products.Where(x => x.Id == new Guid(id)).Select(x => new ProductResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                Currency = x.Currency,
                ManufacturingDate = x.ManufacturingDate,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted
            }).FirstOrDefault();

            return product;
        }

        public string SaveOrUpdateProduct(ProductRequestModel product, string xCorrelationId)
        {
            var productDetail = _dbContext.Products.FirstOrDefault(x => x.Id == product.Id);

            if (productDetail == null)
            {
                productDetail = new();
                productDetail.Name = product.Name;
                productDetail.Description = product.Description;
                productDetail.Price = product.Price;
                productDetail.ImageUrl = product.ImageUrl;
                productDetail.ManufacturingDate = product.ManufacturingDate;
                productDetail.KeyFeatures = JsonSerializer.Serialize(product.KeyFeatures);
                productDetail.Uses = JsonSerializer.Serialize(product.Uses);
                productDetail.CategoryId = new Guid(product.CategoryId);
                productDetail.IsActive = true;
                productDetail.CreatedDate = DateTime.UtcNow;
                productDetail.Currency = product.Currency;

                _dbContext.Products.Add(productDetail);
            }
            else if (productDetail != null && productDetail.Id == product.Id)
            {
                productDetail.Name = product.Name;
                productDetail.Description = product.Description;
                productDetail.Price = product.Price;
                productDetail.ManufacturingDate = product.ManufacturingDate;
                productDetail.KeyFeatures = JsonSerializer.Serialize(productDetail.KeyFeatures);
                productDetail.Uses = JsonSerializer.Serialize(productDetail.Uses);
                productDetail.ModifiedDate = DateTime.UtcNow;
                productDetail.IsActive = product.IsActive;

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
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate
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
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate
            }).FirstOrDefault();

            return category;
        }

        public string SaveOrUpdateCategory(CategoryRequestModel category, string xCorrelationId)
        {
            var categoryDetail = _dbContext.Categories.FirstOrDefault(x => x.Id == category.Id);

            if (categoryDetail == null)
            {
                categoryDetail = new();
                categoryDetail.Name = category.Name;
                categoryDetail.Description = category.Description;
                categoryDetail.ImageUrl = category.ImageUrl;
                categoryDetail.CreatedDate = DateTime.UtcNow;
                categoryDetail.IsActive = true;

                _dbContext.Categories.Add(categoryDetail);
            }
            else if (categoryDetail != null && categoryDetail.Id == category.Id)
            {
                categoryDetail.Name = category.Name;
                categoryDetail.Description = category.Description;
                categoryDetail.ImageUrl = category.ImageUrl;
                categoryDetail.ModifiedDate = DateTime.UtcNow;
                categoryDetail.IsActive = category.IsActive;

                _dbContext.Categories.Update(categoryDetail);
            }
            _dbContext.SaveChanges();
            return categoryDetail.Id.ToString();
        }

        public string DeleteCategoryById(string id, string xCorrelationId)
        {
            var categoryDetail = _dbContext.Categories.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

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
                ModifiedDate = x.ModifiedDate
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
                ModifiedDate = x.ModifiedDate
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
                    IsActive = true
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
    }
}
